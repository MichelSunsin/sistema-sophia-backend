const oracledb = require('oracledb')
const express = require('express')
const connectDB = require('../config/db')

const router = express.Router()

/* Deficiency methods */
router.get('/:codigo(\\d+)/deficiencies', async (req, res) => {
  let connection

  try {
    connection = await connectDB()
    const sql = `SELECT descricao "descricao",
    WHERE codigo = :codigo`

    const result = await connection.execute(sql, [req.params.codigo], {
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

router.put('/:codigo(\\d+)/deficiency/:descricao', async (req, res) => {
  let connection
  const options = {
    outFormat: oracledb.OUT_FORMAT_OBJECT,
    autoCommit: true,
  }

  try {
    connection = await connectDB()

    let sql = `UPDATE deficiencia
    SET descricao = :0,
    WHERE matricula = :1`

    await connection.execute(
      sql,
      [req.params.deficiencia, req.params.codigo],
      options
    )

    await connection.execute(
      sql,
      [nome, certNasc, dataNasc, req.params.matricula],
      options
    )

    res.status(200).send('Deficiência atribuída com sucesso')
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
  const { nome, cpf, dataNasc, telefone, celular, descricaoCorporal } = req.body

  try {
    connection = await connectDB()

    let sql = `INSERT INTO responsavel (nome, cpf, dataNasc, telefone, celular, descricaoCorporal)
    VALUES (:0, :1, TO_DATE(:2, 'YYYY-MM-DD'), :3, :4, :5)
    RETURNING codigo INTO :codigo`

    const result = await connection.execute(
      sql,
      [
        nome,
        cpf,
        dataNasc,
        telefone,
        celular,
        descricaoCorporal,
        { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
      ],
      options
    )

    await connection.execute(
      sql,
      [result.outBinds[0][0], nome, certNasc, dataNasc],
      options
    )

    connection.commit()

    res.status(200).json({
      msg: 'Responsável adicionado com sucesso',
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

router.delete('/:codigo(\\d+)', async (req, res) => {
  let connection
  const options = {
    outFormat: oracledb.OUT_FORMAT_OBJECT,
    autoCommit: true,
  }

  try {
    connection = await connectDB()

    let sql = `DELETE FROM responsavel
    WHERE codigo = :0`

    await connection.execute(sql, [req.params.codigo], options)
    res.status(200).send('Responsável removido com sucesso')
  } catch (err) {
    res.status(500).send(err.message)
  } finally {
    try {
      connection && connection.close()
    } catch (error) {}
  }
})
module.exports = router
