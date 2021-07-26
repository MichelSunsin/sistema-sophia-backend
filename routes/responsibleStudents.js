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

  const {
    matriculaAluno,
    codigoResponsavel,
    responsavelFinanceiro = 0,
  } = req.body

  try {
    connection = await connectDB()
    const sql = `INSERT INTO responsavelAluno (codigoResponsavel, matriculaAluno, responsavelFinanceiro)
    VALUES (:0, :1, :2)`

    await connection.execute(
      sql,
      [codigoResponsavel, matriculaAluno, responsavelFinanceiro],
      options
    )

    res.status(200).send('Aluno atribuído a responsável com sucesso')
  } catch (err) {
    res.status(500).send(err.message)
  } finally {
    try {
      connection && connection.close()
    } catch (error) {}
  }
})

router.put('/', async (req, res) => {
  let connection
  const options = {
    outFormat: oracledb.OUT_FORMAT_OBJECT,
    autoCommit: true,
  }

  const { codigoResponsavel, matriculaAluno, responsavelFinanceiro } = req.body

  try {
    connection = await connectDB()
    const sql = `UPDATE responsavelAluno
    SET responsavelFinanceiro = :0
    WHERE codigoResponsavel = :1
    AND matriculaAluno = :2`

    await connection.execute(
      sql,
      [responsavelFinanceiro, codigoResponsavel, matriculaAluno],
      options
    )

    res.status(200).send('Aluno atribuído a responsável financeiro com sucesso')
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

  const { matriculaAluno, codigoResponsavel } = req.body

  try {
    connection = await connectDB()
    const sql = `DELETE FROM responsavelAluno 
    WHERE codigoResponsavel = :0 
    AND matriculaAluno = :1`

    await connection.execute(sql, [codigoResponsavel, matriculaAluno], options)

    res.status(200).send('Aluno retirado do responsável com sucesso')
  } catch (err) {
    res.status(500).send(err.message)
  } finally {
    try {
      connection && connection.close()
    } catch (error) {}
  }
})

module.exports = router
