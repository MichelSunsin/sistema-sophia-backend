const oracledb = require('oracledb')
const express = require('express')
const connectDB = require('../config/db')

const router = express.Router()

router.get('/:codigo(\\d+)', async (req, res) => {
  let connection

  try {
    connection = await connectDB()
    const sql = `SELECT 
    cep "cep",
    estado "estado",
    cidade "cidade",
    numero "numero",
    logradouro "logradouro",
    complemento "complemento"
    FROM endereco
    WHERE codigo = :codigo`

    const result = await connection.execute(sql, [req.params.connection], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    })

    res.status(200).json(result.rows[0])
  } catch (err) {
    res.status(500).send(err.message)
  } finally {
    try {
      connection && connection.close()
    } catch (error) {}
  }
})

router.get('/list', async (req, res) => {
  let connection

  try {
    connection = await connectDB()
    const sql = `SELECT 
    codigo "codigo",
    cep "cep",
    estado "estado",
    cidade "cidade",
    numero "numero",
    logradouro "logradouro",
    complemento "complemento"
    FROM endereco
    WHERE codigo = :codigo`

    const result = await connection.execute(sql, [], {
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

router.put('/:codigo(\\d+)', async (req, res) => {
  let connection
  const options = {
    outFormat: oracledb.OUT_FORMAT_OBJECT,
    autoCommit: true,
  }
  const { cep, estado, cidade, numero, logradouro, complemento } = req.body

  try {
    connection = await connectDB()

    let sql = `UPDATE endereco
    SET cep = :0,
    estado = :1,
    cidade = :2,
    numero = :3,
    logradouro = :4,
    complemento = :5
    WHERE codigo = :6`

    await connection.execute(
      sql,
      [cep, estado, cidade, numero, logradouro, complemento, req.params.codigo],
      options
    )

    res
      .status(200)
      .send({
        msg: 'Endereço atualizado com sucesso',
        data: result.outBinds[0][0],
      })
  } catch (err) {
    try {
      connection && connection.rollback()
    } catch (error) {}

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
  const { cep, estado, cidade, numero, logradouro, complemento } = req.body

  try {
    connection = await connectDB()

    let sql = `INSERT INTO endereco (cep, estado, cidade, numero, logradouro, complemento)
    VALUES (:0, :1, :2, :3, :4, :5)
    RETURNING codigo INTO :codigo`

    const result = await connection.execute(
      sql,
      [
        cep,
        estado,
        cidade,
        numero,
        logradouro,
        complemento,
        { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
      ],
      options
    )

    res.status(200).json(result.outBinds[0][0])
  } catch (err) {
    try {
      connection && connection.rollback()
    } catch (error) {}
    res.status(500).send(err.message)
  } finally {
    try {
      connection && connection.close()
    } catch (error) {}
  }
})

router.delete('/:codigo(\\d+)', async (req, res) => {
  let connection
  const options = {
    outFormat: oracledb.OUT_FORMAT_OBJECT,
    autoCommit: true,
  }

  try {
    connection = await connectDB()

    let sql = `DELETE FROM endereco
    WHERE codigo = :0`

    await connection.execute(sql, [req.params.codigo], options)
    res.status(200).send('Endereço removido com sucesso')
  } catch (err) {
    res.status(500).send(err.message)
  } finally {
    try {
      connection && connection.close()
    } catch (error) {}
  }
})

module.exports = router
