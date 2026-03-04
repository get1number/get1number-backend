require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { Pool } = require('pg')

const app = express()
app.use(cors())
app.use(express.json())

let pool = null

// cria conexão com o banco depois que a env carrega
setTimeout(async () => {
  try {
    if (!process.env.DATABASE_URL) {
      console.log('NO DATABASE_URL found')
      return
    }

    console.log('DATABASE_URL found, creating pool...')
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    })

    // cria tabela numbers se não existir
    await pool.query(`
      CREATE TABLE IF NOT EXISTS numbers (
        id SERIAL PRIMARY KEY,
        user_phone VARCHAR(20),
        virtual_number VARCHAR(30),
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `)

    console.log('Table numbers OK')
  } catch (err) {
    console.error('Error creating pool or table:', err.message)
  }
}, 2000)

// rota básica pra ver status
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

// rota para comprar número (fake por enquanto)
app.post('/buy-number', async (req, res) => {
  try {
    if (!pool) {
      return res.status(500).json({ error: 'Sem conexão com o banco' })
    }

    const { phone } = req.body // telefone do cliente

    if (!phone) {
      return res.status(400).json({ error: 'Informe o campo phone no body' })
    }

    // gera um número virtual fake só pra teste
    const virtual = '+1' + Math.floor(1000000000 + Math.random() * 9000000000)

    // salva no banco
    await pool.query(
      'INSERT INTO numbers (user_phone, virtual_number, status) VALUES ($1, $2, $3)',
      [phone, virtual, 'active']
    )

    return res.json({
      success: true,
      virtual_number: virtual
    })
  } catch (err) {
    console.error('Erro /buy-number:', err.message)
    return res.status(500).json({ error: 'Erro interno', details: err.message })
  }
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log('Server running on port ' + port)
})
