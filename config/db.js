const oracledb = require('oracledb')

const connectDB = async () => {
  let connection

  try {
    connection = await oracledb.getConnection({
      user: 'system',
      password: 'admin',
      connectionString: 'localhost:1521/XE',
    })

    console.log('Database connected')
    return connection
  } catch (err) {
    console.error(err)
  }
}

module.exports = connectDB
