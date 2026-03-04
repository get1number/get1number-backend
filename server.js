require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const app = express();

app.use(cors());
app.use(express.json());

let pool;
try {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  console.log('DB pool created');
} catch (e) {
  console.log('DB pool error:', e.message);
}

app.get('/', async (req, res) => {
  if (!pool) return res.json({ status: 'Backend Live', db: 'No DB config' });
  
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ 
      status: 'Get1Number Backend Live!', 
      db: 'Connected ✅',
      time: result.rows[0].now 
    });
  } catch (err) {
    res.json({ status: 'Backend Live', db: 'Query Error', error: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server on port ${port}`));
