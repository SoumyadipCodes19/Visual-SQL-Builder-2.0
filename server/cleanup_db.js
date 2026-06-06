import knex from 'knex';

const db = knex({
  client: 'pg',
  connection: 'postgresql://vsql_user:EF1SXCQqW6uqOpIMDaeZrjncvqz5bKBS@dpg-d8i35m3tqb8s73anbojg-a.ohio-postgres.render.com/vsql?ssl=true',
  searchPath: ['knex', 'public'],
});

async function clean() {
  try {
    await db.schema.dropTableIfExists('sample_customers_1780760320738');
    await db.schema.dropTableIfExists('sample_customers_test_1780760423838');
    await db.schema.dropTableIfExists('sample_customers_1780760543036');
    console.log('Cleaned up junk tables!');
  } catch(e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}

clean();
