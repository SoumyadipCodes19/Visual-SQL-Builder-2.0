import knex from 'knex';
import fs from 'fs';
import csv from 'csv-parser';

const db = knex({
  client: 'pg',
  connection: 'postgresql://vsql_user:EF1SXCQqW6uqOpIMDaeZrjncvqz5bKBS@dpg-d8i35m3tqb8s73anbojg-a.ohio-postgres.render.com/vsql?ssl=true',
  searchPath: ['knex', 'public'],
});

function detectColumnType(values) {
  let isInteger = true;
  let isNumeric = true;
  let isDate = true;

  for (const val of values) {
    if (!val) continue;
    if (isInteger && !/^-?\d+$/.test(val)) isInteger = false;
    if (isNumeric && isNaN(Number(val))) isNumeric = false;
    if (isDate && isNaN(Date.parse(val))) {
      if (/^-?\d+$/.test(val)) isDate = false;
    }
  }
  if (isInteger) return 'integer';
  if (isNumeric) return 'numeric';
  if (isDate) return 'date';
  return 'text';
}

async function test() {
  const results = [];
  let headers = [];

  fs.createReadStream('../sample_customers.csv')
    .pipe(csv())
    .on('headers', h => headers = h)
    .on('data', d => results.push(d))
    .on('end', async () => {
      try {
        let tableName = 'sample_customers_test_' + Date.now();
        
        const sample = results.slice(0, 50);
        const colTypes = {};
        for (const h of headers) {
          colTypes[h] = detectColumnType(sample.map(row => row[h]));
        }

        console.log('Column Types:', colTypes);

        await db.schema.createTable(tableName, (table) => {
          for (const h of headers) {
            const type = colTypes[h];
            if (type === 'integer') table.integer(h);
            else if (type === 'numeric') table.decimal(h, 10, 2);
            else if (type === 'date') table.date(h);
            else table.string(h);
          }
        });
        console.log('Created table:', tableName);

        const chunk = results.map(row => {
          const cleanRow = {};
          for (const key in row) {
            cleanRow[key] = row[key] === '' ? null : row[key];
          }
          return cleanRow;
        });

        await db(tableName).insert(chunk);
        console.log('Inserted successfully!');

      } catch (err) {
        console.error('ERROR OCCURRED:', err.message);
      } finally {
        process.exit(0);
      }
    });
}

test();
