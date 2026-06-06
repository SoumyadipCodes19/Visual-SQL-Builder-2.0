import db from './db.js';
import { DB_SCHEMA, MOCK_DATA } from '../src/data/schema.js';

async function seed() {
  console.log('Starting seed process...');

  for (const tableName of Object.keys(DB_SCHEMA)) {
    const columns = DB_SCHEMA[tableName];
    
    // Drop table if exists
    await db.schema.dropTableIfExists(tableName);
    console.log(`Dropped table: ${tableName}`);

    // Create table
    await db.schema.createTable(tableName, (table) => {
      for (const col of columns) {
        if (col.type === 'uuid') {
          table.string(col.name).primary();
        } else if (col.type === 'text') {
          table.string(col.name);
        } else if (col.type === 'date') {
          table.date(col.name);
        } else if (col.type === 'numeric') {
          table.decimal(col.name, 10, 2);
        } else if (col.type === 'integer') {
          table.integer(col.name);
        } else {
          table.string(col.name);
        }
      }
    });
    console.log(`Created table: ${tableName}`);

    // Insert data
    const rows = MOCK_DATA[tableName];
    if (rows && rows.length > 0) {
      await db(tableName).insert(rows);
      console.log(`Inserted ${rows.length} rows into ${tableName}`);
    }
  }

  console.log('Seeding complete!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
