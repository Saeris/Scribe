import config from '../config/server.config'
import * as Tables from './tables'
import * as Lists from './lists'
const { log, error } = console

export const Models = { ...Tables, ...Lists }

export default Models

const create = knex => Object.values(Models)
  .filter(migration => (!!migration.fields || !!migration.foreignKeys))
  .map(migration => knex.schema.createTableIfNotExists(migration.name, (table) => {
    migration.fields(table)
    if (config.ENV === `test` || config.ENV === `development` && !!migration.foreignKeys) migration.foreignKeys(table)
  })
  .then(() => log(`Created table: ${migration.name}`))
  .catch(err => error(`Failed to create table: ${migration.name}`, err)))

const update = knex => Object.values(Models)
  .filter(migration => !!migration.foreignKeys)
  .map(migration => knex.schema.table(migration.name, table => migration.foreignKeys(table))
  .then(() => log(`Set Foreign Keys on table: ${migration.name}`))
  .catch(err => error(`Failed to alter table: ${migration.name}`, err)))

const destroy = knex => Object.values(Models)
  .map(migration => knex.schema.dropTableIfExists(migration.name)
  .then(() => log(`Destroyed table: ${migration.name}`))
  .catch(err => error(`Failed to destroy table: ${migration.name}`, err)))

// http://knexjs.org/#Migrations-API

const pragma = `
  PRAGMA foreign_keys = ON;
  PRAGMA synchronous = OFF;
  PRAGMA journal_mode = MEMORY;
  PRAGMA temp_store = MEMORY;
  PRAGMA count_changes = OFF;
  `

export const up = (knex, Promise) => knex
  .raw(`${ config.env === `production` ? `SET foreign_key_checks = 0;` : pragma }`)
  .then(() => Promise.all(create(knex)))
  .then(() => config.env === `production` ? Promise.all(update(knex)) : null)
  .then(() => config.env === `production` ? knex.raw(`SET foreign_key_checks = 1;`) : null)

export const down = (knex, Promise) => knex
  .raw(`${ config.env === `production` ? `SET foreign_key_checks = 0;` : `` }`)
  .then(() => Promise.all(destroy(knex)))
  .then(() => config.env === `production` ? knex.raw(`SET foreign_key_checks = 1;`) : null)
