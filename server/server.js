import express from 'express';
import cors from 'cors';
import multer from 'multer';
import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';
import db from './db.js';
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 3001;

// Allow CORS from specified FRONTEND_URL or all origins in development
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*'
};
app.use(cors(corsOptions));
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

// Helper to determine SQLite column type from an array of string values
function detectColumnType(values) {
  let isInteger = true;
  let isNumeric = true;
  let isDate = true;

  for (const val of values) {
    if (!val) continue;
    
    if (isInteger && !/^-?\d+$/.test(val)) {
      isInteger = false;
    }
    if (isNumeric && isNaN(Number(val))) {
      isNumeric = false;
    }
    if (isDate && isNaN(Date.parse(val))) {
      // Very basic date check. If it parses as a date but is just a number, it might be a false positive
      // Real date validation might need moment or stricter regex, but this works for basic cases
      if (/^-?\d+$/.test(val)) {
        isDate = false; // Don't treat raw integers as dates
      }
    }
  }

  if (isInteger) return 'integer';
  if (isNumeric) return 'numeric';
  if (isDate) return 'date';
  return 'text';
}

// 1. GET /api/schema - Returns available tables and their column definitions
app.get('/api/schema', async (req, res) => {
  try {
    // Get all tables in SQLite
    const tables = await db.raw("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'");
    const schema = {};

    for (const table of tables) {
      const tableName = table.name;
      // Get column info
      const cols = await db.raw(`PRAGMA table_info('${tableName}')`);
      schema[tableName] = cols.map(c => ({
        name: c.name,
        type: c.type.toLowerCase()
      }));
    }

    res.json(schema);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch schema' });
  }
});

// 2. POST /api/query - Receives AST, executes query
app.post('/api/query', async (req, res) => {
  try {
    const { table, selectedColumns, filters, orderField, orderDirection, limit, groupByField, aggregateFunc, aggregateField } = req.body;
    
    if (!table) {
      return res.status(400).json({ error: 'Table is required' });
    }

    let query = db(table);

    // Filter Building
    if (filters && filters.length > 0) {
      filters.forEach((f, index) => {
        if (!f.field || !f.value) return;

        const applyFilter = (q) => {
          if (f.operator === 'LIKE') {
            q.where(f.field, 'LIKE', `%${f.value}%`);
          } else if (f.operator === 'BETWEEN') {
            q.whereBetween(f.field, [f.value, f.value2]);
          } else {
            q.where(f.field, f.operator, f.value);
          }
        };

        if (index === 0) {
          applyFilter(query);
        } else {
          if (f.connector === 'OR') {
            query.orWhere((q) => applyFilter(q));
          } else {
            query.andWhere((q) => applyFilter(q));
          }
        }
      });
    }

    // Selects / Aggregates / Group By
    if (groupByField) {
      const selects = [groupByField];
      selectedColumns.forEach(c => {
         if (c !== groupByField) selects.push(db.raw(`MAX(??) as ??`, [c, c])); // Pseudo select for other cols
      });
      if (aggregateFunc && aggregateField) {
        const alias = `${aggregateFunc.toLowerCase()}_${aggregateField}`;
        selects.push(db.raw(`${aggregateFunc}(??) as ??`, [aggregateField, alias]));
      }
      query.select(selects).groupBy(groupByField);
    } else {
      const selects = [...selectedColumns];
      if (aggregateFunc && aggregateField) {
        const alias = `${aggregateFunc.toLowerCase()}_${aggregateField}`;
        selects.push(db.raw(`${aggregateFunc}(??) as ??`, [aggregateField, alias]));
      }
      query.select(selects.length > 0 ? selects : '*');
    }

    // Order By
    if (orderField) {
      query.orderBy(orderField, orderDirection || 'ASC');
    }

    // Limit
    if (limit) {
      query.limit(limit);
    }

    // Capture SQL for the UI preview
    const sqlString = query.toString();
    const rows = await query;

    res.json({ sql: sqlString, rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Query execution failed', details: error.message });
  }
});

// 3. POST /api/upload-csv
app.post('/api/upload-csv', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const results = [];
  let headers = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('headers', (h) => {
      headers = h;
    })
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      fs.unlinkSync(req.file.path); // remove temp file

      if (results.length === 0) {
        return res.status(400).json({ error: 'CSV is empty' });
      }

      // Generate table name from filename
      let tableName = req.file.originalname.replace('.csv', '').replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
      if (!tableName) tableName = 'table_' + Date.now();
      
      // Prevent overwriting existing mock tables
      const existing = await db.raw(`SELECT name FROM sqlite_master WHERE type='table' AND name=?`, [tableName]);
      if (existing.length > 0) {
        tableName = tableName + '_' + Date.now();
      }

      // Detect column types based on first 50 rows
      const sample = results.slice(0, 50);
      const colTypes = {};
      
      for (const h of headers) {
        const vals = sample.map(row => row[h]);
        colTypes[h] = detectColumnType(vals);
      }

      // Create Table
      await db.schema.createTable(tableName, (table) => {
        for (const h of headers) {
          const type = colTypes[h];
          if (type === 'integer') table.integer(h);
          else if (type === 'numeric') table.decimal(h, 10, 2);
          else if (type === 'date') table.date(h);
          else table.string(h);
        }
      });

      // Insert Data (Chunked)
      const chunkSize = 100;
      for (let i = 0; i < results.length; i += chunkSize) {
        const chunk = results.slice(i, i + chunkSize);
        await db(tableName).insert(chunk);
      }

      res.json({ success: true, tableName, rowCount: results.length });
    })
    .on('error', (err) => {
       fs.unlinkSync(req.file.path);
       res.status(500).json({ error: 'Error parsing CSV' });
    });
});

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
