import dotenv  from 'dotenv'
import knex from 'knex'

dotenv.config()

// connect without database selected
const db = knex({
  client: `mysql`,
  connection: {
    host:     process.env.DB_HOST || `127.0.0.1`,
    user:     process.env.DB_USERNAME || `root`,
    password: process.env.DB_PASSWORD || `password`,
    charset:  `utf8`
  }
})

async function resetdb() {
  await db.raw(`DROP DATABASE IF EXISTS scribe;`).then(res => res)
  await db.raw(`CREATE DATABASE IF NOT EXISTS scribe;`).then(res => res)
  db.destroy()
}

resetdb()
