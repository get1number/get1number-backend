require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('Get1Number API Backend Live! DB: ' + process.env.DATABASE_URL ? 'Connected' : 'No DB'));
app.listen(process.env.PORT || 3000, () => console.log('Server running'));
