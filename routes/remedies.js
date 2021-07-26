const oracledb = require('oracledb')
const express = require('express')
const connectDB = require('../config/db')

const router = express.Router()

/* Deficiency methods */
router.get('/:matricula(\\d+)', async (req, res) => {
  let connection

  try {
    connection = await connectDB()
    const sql = `SELECT descricao "descricao"
    FROM remedio
    WHERE matricula = :0`

    const result = await connection.execute(sql, [req.params.matricula], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    })

    res.status(200).json(result.rows)
  } catch (err) {
    res.status(500).send(err.message)
  } finally {
    try {
      connection && connection.close()
    } catch (error) {}
  }
})

router.post('/', async (req, res) => {
  let connection
  const options = {
    outFormat: oracledb.OUT_FORMAT_OBJECT,
    autoCommit: true,
  }
  const { matricula, descricao } = req.body

  try {
    connection = await connectDB()

    let sql = `INSERT INTO remedio (matricula, descricao)
    VALUES (:0, :1)`

    await connection.execute(sql, [matricula, descricao], options)

    res.status(200).send('Remédio atribuído com sucesso')
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

  const { matricula, descricao } = req.body

  try {
    connection = await connectDB()

    let sql = `DELETE FROM remedio
    WHERE matricula = :0 
    AND descricao = :1`

    await connection.execute(sql, [matricula, descricao], options)
    res.status(200).send('Remédio removido com sucesso')
  } catch (err) {
    res.status(500).send(err.message)
  } finally {
    try {
      connection && connection.close()
    } catch (error) {}
  }
})
module.exports = router
