require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.get('/', async (req, res) => {
  try {
    await pool.query('SELECT NOW()');
    res.json({ status: 'Get1Number Backend Live!', db: 'Connected ✅' });
  } catch (e) {
    res.json({ status: 'Backend Live', db: 'Error: ' + e.message });
  }
});

// Criar tabela números (auto)
pool.query(`
  CREATE TABLE IF NOT EXISTS numbers (
    id SERIAL PRIMARY KEY,
    phone VARCHAR(20) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  )
`);

app.listen(process.env.PORT || 3000, () => console.log('Server running'));
