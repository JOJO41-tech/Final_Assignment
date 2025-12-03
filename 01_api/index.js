const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Common DB config
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'dit312_6703466',
  port: Number(process.env.DB_PORT || 3306),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

const pool = mysql.createPool(dbConfig);

/**
 * Wait until DB is ready before we start answering traffic.
 * This reduces ECONNREFUSED during container startup.
 */
async function waitForDb(retries = 15, delayMs = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      const conn = await mysql.createConnection({
        host: dbConfig.host,
        user: dbConfig.user,
        password: dbConfig.password,
        database: dbConfig.database,
        port: dbConfig.port,
      });
      await conn.ping();
      await conn.end();
      console.log('✅ Database is ready');
      return;
    } catch (err) {
      console.log(
        `⏳ DB not ready (attempt ${i + 1}/${retries}): ${err.message}`
      );
      await new Promise((res) => setTimeout(res, delayMs));
    }
  }
  throw new Error('Database not ready after multiple attempts');
}

app.get('/health', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 AS ok');
    res.json({ status: 'ok', db: rows[0].ok === 1 });
  } catch (e) {
    console.error(e);
    res.status(500).json({ status: 'error', message: e.message });
  }
});

app.get('/videogames', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, title, genre, description, coverimage, platform, year FROM videogame'
    );
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const port = Number(process.env.PORT || 3001);

// Start server only after DB is reachable
(async () => {
  try {
    await waitForDb();
    app.listen(port, () =>
      console.log(`API listening on http://localhost:${port}`)
    );
  } catch (err) {
    console.error('❌ Failed to start API:', err.message);
    process.exit(1);
  }
})();
