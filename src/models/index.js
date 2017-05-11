import path from 'path'
import glob from 'glob' // https://github.com/isaacs/node-glob
import config from '../config/server.config'

export function loadModels() {
  let modelsArray = []

  glob.sync(`${__dirname}/**/!(*.spec).js`).forEach( file => {
    let filename = path.basename(file)
    if (filename !== `index.js`) {
      modelsArray.push(require(file).default)
    }
  })

  return modelsArray
}

function models() {
  let collection = {}

  loadModels().forEach((model) => {
    collection[model.name] = model
    console.log(`Loaded Model Definition: ${model.name}`)
  })

  return collection
}

export const Models = models()

export default Models

export function definitions() {
  let collection = []

  loadModels().forEach((Model) => {
    let Instance = new Model
    if (Instance.Definition) {
      collection.push(Instance.Definition)
      console.log(`Loaded Type Definition: ${Instance.Definition.name}`)
    }
  })

  return collection
}

export function queries() {
  let collection = []

  loadModels().forEach((Model) => {
    let Instance = new Model
    if (Instance.Queries) {
      //console.log('Found Queries:')
      //console.log(Instance.Queries)
      collection.push(Instance.Queries)
    }
  })

  return collection
}

export function mutations() {
  let collection = []

  loadModels().forEach((Model) => {
    let Instance = new Model
    if (Instance.Mutations) collection.push(Instance.Mutations)
  })

  return collection
}

function loadMigrations(knex, callback) {
  let migration = []

  glob.sync(`${__dirname}/**/!(*.spec).js`).forEach( file => {
    let filename = path.basename(file)
    if (filename !== `index.js`) {
      migration.push(require(file).default)
    }
  })

  return callback(knex, migration)
}

function create(knex, migrations) {
  let toBeCreated = []

  for (let migration of migrations) {
    // http://knexjs.org/#Schema-createTableIfNotExists
    if (!!migration.fields || !!migration.foreignKeys) {
      toBeCreated.push(
        knex.schema.createTableIfNotExists(migration.name, (table) => {
          if (!!migration.fields) migration.fields(table)
          if (config.ENV === `test` || config.ENV === `development` && !!migration.foreignKeys) migration.foreignKeys(table)
        })
        .then(() => {
          console.log(`Created table: ${migration.name}`)
        })
        .catch((err) => {
          console.log(`Failed to create table: ${migration.name}`)
          console.error(err)
        })
      )
    }
  }

  return toBeCreated
}

function update(knex, migrations) {
  let toBeUpdated = []

  for (let migration of migrations) {
    if (!!migration.foreignKeys) {
      toBeUpdated.push(
        knex.schema.table(migration.name, (table) => {
          migration.foreignKeys(table)
        })
        .then(() => {
          console.log(`Set Foreign Keys on table: ${migration.name}`)
        })
        .catch((err) => {
          console.log(`Failed to alter table: ${migration.name}`)
          console.error(err)
        })
      )
    }
  }

  return toBeUpdated
}

function destroy(knex, migrations) {
  let toBeDestroyed = []

  for (let migration of migrations) {
    // http://knexjs.org/#Schema-dropTableIfExists
    toBeDestroyed.push(
      knex.schema.dropTableIfExists(migration.name)
      .then(() => {
        console.log(`Destroyed table: ${migration.name}`)
      })
      .catch((err) => {
        console.log(`Failed to destroy table: ${migration.name}`)
        console.error(err)
      })
    )
  }

  return toBeDestroyed
}

// http://knexjs.org/#Migrations-API

const pragma = `
  PRAGMA foreign_keys = ON;
  PRAGMA synchronous = OFF;
  PRAGMA journal_mode = MEMORY;
  PRAGMA temp_store = MEMORY;
  PRAGMA count_changes = OFF;
  `

export function up(knex, Promise) {
  return knex.raw(`${ config.ENV === `production` ? `SET foreign_key_checks = 0;` : pragma }`)
    .then(() => {
      return Promise.all(loadMigrations(knex, create))
    })
    .then(() => {
      if (config.ENV === `production`) return Promise.all(loadMigrations(knex, update))
    })
    .then(() => {
      if (config.ENV === `production`) return knex.raw(`SET foreign_key_checks = 1;`)
    })
}

export function down(knex, Promise) {
  return knex.raw(`${ config.ENV === `production` ? `SET foreign_key_checks = 0;` : `` }`)
  .then(() => {
    return Promise.all(loadMigrations(knex, destroy))
  })
  .then(() => {
    if (config.ENV === `production`) return knex.raw(`SET foreign_key_checks = 1;`)
  })
}
