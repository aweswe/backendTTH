require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Allow self-signed certificates
  },
});

console.log('Connecting with:', {
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

async function testConnection() {
  console.log('Trying to connect to PostgreSQL...');
  try {
    const client = await pool.connect();
    console.log('Connection successful!');
    const res = await client.query('SELECT NOW()');
    console.log('Current time in DB:', res.rows[0]);
    const dbRes = await client.query('SELECT current_database() as db_name');
    console.log('Connected to database:', dbRes.rows[0]);
    client.release();
  } catch (err) {
    console.error('Connection error:', err);
  } finally {
    await pool.end();
  }
}

testConnection();