require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.json({ 
  status: 'Get1Number API ✅ Live!', 
  message: 'Backend pronto pro frontend!',
  db: process.env.DATABASE_URL ? 'Config OK' : 'Sem DB ainda'
}));

app.post('/numbers', (req, res) => res.json({ success: true, phone: req.body.phone }));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Get1Number Backend OK'));
