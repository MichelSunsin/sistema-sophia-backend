const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json({ extended: true }))

app.get('/', async (req, res) => {
  res.send('Bem-vindo a API do Sistema Sophia')
})

// Definição de rotas
app.use('/api/students', require('./routes/students'))
app.use('/api/responsible', require('./routes/responsible'))
app.use('/api/addresses', require('./routes/addresses'))
app.use('/api/deficiencies', require('./routes/deficiencies'))
app.use('/api/remedies', require('./routes/remedies'))

const PORT = 3001

app.listen(PORT, () => console.log(`Server started in port ${PORT}`))
