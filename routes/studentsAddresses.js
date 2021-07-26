const oracledb = require('oracledb')
const express = require('express')
const connectDB = require('../config/db')

const router = express.Router()

router.post('/', async (req, res) => {
  let connection
  const options = {
    outFormat: oracledb.OUT_FORMAT_OBJECT,
    autoCommit: true,
  }

  const { matriculaAluno, codigoEndereco } = req.body

  try {
    connection = await connectDB()
    const sql = `INSERT INTO enderecoAluno (matriculaAluno, codigoEndereco)
    VALUES (:0, :1)`

    await connection.execute(sql, [matriculaAluno, codigoEndereco], options)

    res.status(200).send('Endereço atribuído a aluno com sucesso')
  } catch (err) {
    res.status(500).send(err.message)
  } finally {
    try {
      connection && connection.close()
    } catch (error) {}
  }
})

router.delete('/', async (req, res) => {
  let connection
  const options = {
    outFormat: oracledb.OUT_FORMAT_OBJECT,
    autoCommit: true,
  }

  const { matriculaAluno, codigoEndereco } = req.body

  try {
    connection = await connectDB()
    const sql = `DELETE FROM enderecoAluno 
    WHERE matriculaAluno = :0
    AND codigoEndereco = :1`

    await connection.execute(sql, [matriculaAluno, codigoEndereco], options)

    res.status(200).send('Aluno retirado do endereço com sucesso')
  } catch (err) {
    res.status(500).send(err.message)
  } finally {
    try {
      connection && connection.close()
    } catch (error) {}
  }
})

module.exports = router
