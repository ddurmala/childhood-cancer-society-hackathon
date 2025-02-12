const { Client } = require('pg');

const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:pass@localhost:5432/swap_data_2'
});

async function testDB() {
    try {
        await client.connect();
        const res = await client.query(`SELECT * FROM "public"."dex.trades" LIMIT 5;`);
        console.log(res.rows);
    } catch (err) {
        console.error('DB Error:', err);
    } finally {
        await client.end();
    }
}

testDB();
