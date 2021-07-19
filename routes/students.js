const oracledb = require('oracledb')
const express = require('express')
const connectDB = require('../config/db')

const router = express.Router()

router.get('/:matricula(\\d+)', async (req, res) => {
  let connection

  try {
    connection = await connectDB()
    const sql = `SELECT 
    aluno.matricula "matricula",
    aluno.nome "nome",
    aluno.certNasc "certNasc",
    TO_CHAR(aluno.dataNasc, 'yyyy-mm-dd') "dataNasc",
    matricula.turno "turno",
    matricula.turma "turma",
    matricula.ano "ano"
    FROM aluno
    INNER JOIN matricula ON aluno.matricula = matricula.codigo
    WHERE aluno.matricula = :matricula`

    const result = await connection.execute(sql, [req.params.matricula], {
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
    const sql = `SELECT matricula "matricula",
      nome "nome",
      certNasc "certNasc",
      TO_CHAR(dataNasc, 'dd/mm/yyyy') "dataNasc"
      FROM aluno`

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

router.put('/:matricula(\\d+)', async (req, res) => {
  let connection
  const options = {
    outFormat: oracledb.OUT_FORMAT_OBJECT,
  }
  const { turno, turma, ano, nome, certNasc, dataNasc } = req.body

  try {
    connection = await connectDB()

    let sql = `UPDATE matricula
    SET turno = :0,
    turma = :1,
    ano = :2
    WHERE codigo = :3`

    await connection.execute(
      sql,
      [turno, turma, ano, req.params.matricula],
      options
    )

    sql = `UPDATE aluno
    SET nome = :0,
    certNasc = :1,
    dataNasc = TO_DATE(:2, 'YYYY-MM-DD')
    WHERE matricula = :3`

    await connection.execute(
      sql,
      [nome, certNasc, dataNasc, req.params.matricula],
      options
    )

    connection.commit()

    res.status(200).send('Aluno atualizado com sucesso')
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
    autoCommit: false,
  }
  const { turno, turma, ano, nome, certNasc, dataNasc } = req.body

  try {
    connection = await connectDB()

    let sql = `INSERT INTO matricula (turno, turma, ano)
    VALUES (:0, :1, :2)
    RETURNING codigo INTO :matricula`

    const result = await connection.execute(
      sql,
      [turno, turma, ano, { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }],
      options
    )

    sql = `INSERT INTO aluno (matricula, nome, certNasc, dataNasc)
    VALUES (:0, :1, :2, TO_DATE(:3, 'YYYY-MM-DD'))`

    await connection.execute(
      sql,
      [result.outBinds[0][0], nome, certNasc, dataNasc],
      options
    )

    connection.commit()

    res
      .status(200)
      .json({ msg: 'Aluno inserido com suceso', data: result.outBinds[0][0] })
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

router.delete('/:matricula(\\d+)', async (req, res) => {
  let connection
  const options = {
    outFormat: oracledb.OUT_FORMAT_OBJECT,
    autoCommit: true,
  }

  try {
    connection = await connectDB()

    let sql = `DELETE FROM matricula
    WHERE codigo = :0`

    await connection.execute(sql, [req.params.matricula], options)
    res.status(200).send('Aluno removido com sucesso')
  } catch (err) {
    res.status(500).send(err.message)
  } finally {
    try {
      connection && connection.close()
    } catch (error) {}
  }
})

module.exports = router
