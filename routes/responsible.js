const oracledb = require('oracledb')
const express = require('express')
const connectDB = require('../config/db')

const router = express.Router()

router.get('/:codigo(\\d+)', async (req, res) => {
  let connection

  try {
    connection = await connectDB()
    const sql = `SELECT codigo "codigo",
    nome "nome",
    cpf "cpf",
    TO_CHAR(dataNasc, 'yyyy-mm-dd') "dataNasc",
    telefone "telefone",
    celular "celular",
    descricaoCorporal "descricaoCorporal"
    FROM responsavel
    WHERE codigo = :codigo`

    const result = await connection.execute(sql, [req.params.codigo], {
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
    const sql = `SELECT codigo "codigo",
    nome "nome",
    cpf "cpf",
    TO_CHAR(dataNasc, 'yyyy-mm-dd') "dataNasc",
    telefone "telefone",
    celular "celular",
    descricaoCorporal "descricaoCorporal",
    CASE WHEN responsavelAluno.codigoResponsavel IS NULL THEN 0 ELSE 1 END "responsavel",
    CASE WHEN responsavelAluno.responsavelFinanceiro IS NULL THEN 0 ELSE responsavelAluno.responsavelFinanceiro END "responsavelFinanceiro"
    FROM responsavel
    LEFT JOIN responsavelAluno ON responsavel.codigo = responsavelAluno.codigoResponsavel
    ORDER BY responsavelAluno.codigoResponsavel`

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
  const { nome, cpf, dataNasc, telefone, celular, descricaoCorporal } = req.body

  try {
    connection = await connectDB()

    let sql = `UPDATE responsavel
    SET nome = :0,
    cpf = :1,
    dataNasc = TO_DATE(:2, 'YYYY-MM-DD'),
    telefone = :3,
    celular = :4,
    descricaoCorporal = :5
    WHERE codigo = :6`

    await connection.execute(
      sql,
      [
        nome,
        cpf,
        dataNasc,
        telefone,
        celular,
        descricaoCorporal,
        req.params.codigo,
      ],
      options
    )

    res.status(200).json({
      msg: 'Responsável atualizado com sucesso',
      data: req.params.codigo,
    })
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

    // await connection.execute(
    //   sql,
    //   [result.outBinds[0][0], nome, certNasc, dataNasc],
    //   options
    // )

    connection.commit()

    res.status(200).json({
      msg: 'Responsável adicionado com sucesso',
      data: result.outBinds[0][0],
    })
  } catch (err) {
    try {
      connection && connection.rollback()
    } catch (err) {}
    res.status(500).send(err.message)
  } finally {
    try {
      connection && connection.close()
    } catch (err) {}
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
