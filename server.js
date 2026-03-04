require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { Pool } = require('pg')

const app = express()
app.use(cors())
app.use(express.json())

let pool = null

// espera 2 segundos pra garantir que a env DATABASE_URL carregou
setTimeout(() => {
  if (process.env.DATABASE_URL) {
    console.log('DATABASE_URL found, creating pool...')
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    })
  } else {
    console.log('NO DATABASE_URL found')
  }
}, 2000)

// rota básica pra ver status da API e do DB
app.get('/', async (req, res) => {
  try {
    if (!pool) {
      return res.json({
        status: 'Get1Number API ✅ Live!',
        message: 'Backend pronto pro frontend!',
        db: 'Sem DB ainda'
      })
    }

    const result = await pool.query('SELECT NOW()')
    return res.json({
      status: 'Get1Number API ✅ Live!',
      message: 'Backend pronto pro frontend!',
      db: 'Connected',
      time: result.rows[0].now
    })
  } catch (err) {
    console.error('DB error:', err.message)
    return res.json({
      status: 'Get1Number API ✅ Live!',
      message: 'Backend pronto pro frontend!',
      db: 'Erro ao conectar',
      error: err.message
    })
  }
})

// porta padrão Render
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log('Server running on port ' + port)
})
