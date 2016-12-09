import path from 'path'
import glob from 'glob' // https://github.com/isaacs/node-glob

export function loadModels() {
  let modelsArray = []

  glob.sync(`${__dirname}/**/!(*.spec).js`).forEach( file => {
    let filename = path.basename(file)
    if(filename !== `index.js`) {
      modelsArray.push(require(file).default)
    }
  })

  return modelsArray
}

function models() {
  let models = {}

  loadModels().forEach((model) => {
    models[model.name] = model
    console.log(`✓ Loaded Model Definition: ${model.name}`)
  })

  return models
}

export const Models = models()

export default Models

function loadMigrations(knex, callback) {
  let migration = []

  glob.sync(`${__dirname}/**/!(*.spec).js`).forEach( file => {
    let filename = path.basename(file)
    if(filename !== `index.js`) {
      migration.push(require(file).default)
    }
  })

  return callback(knex, migration)
}

function create(knex, migrations) {
  let toBeCreated = []

  migrations.forEach(migration => {
    // http://knexjs.org/#Schema-createTableIfNotExists
    toBeCreated.push(
      knex.schema.createTableIfNotExists(migration.name, (table) => {
        migration.fields(table)
      })
      .then(() => {
        console.log(`✓ Created table: ${migration.name}`)
      })
      .catch((err) => {
        console.log(`Failed to create table: ${migration.name}`)
        console.error(err)
      })
    )
  })

  return toBeCreated
}

function update(knex, migrations) {
  let toBeUpdated = []

  migrations.forEach(migration => {
    toBeUpdated.push(
      knex.schema.table(migration.name, (table) => {
        migration.foreignKeys(table)
      })
      .then(() => {
        console.log(`✓ Set Foreign Keys on table: ${migration.name}`)
      })
      .catch((err) => {
        console.log(`Failed to alter table: ${migration.name}`)
        console.error(err)
      })
    )
  })

  return toBeUpdated
}

function destroy(knex, migrations) {
  let toBeDestroyed = []

  migrations.forEach(migration => {
    // http://knexjs.org/#Schema-dropTableIfExists
    toBeDestroyed.push(
      knex.schema.dropTableIfExists(migration.name)
      .then(() => {
        console.log(`✓ Destroyed table: ${migration.name}`)
      })
      .catch((err) => {
        console.log(`Failed to destroy table: ${migration.name}`)
        console.error(err)
      })
    )
  })

  return toBeDestroyed
}

// http://knexjs.org/#Migrations-API

export function up(knex, Promise) {
  return knex.raw('SET foreign_key_checks = 0;')
    .then(() => {
      return Promise.all(loadMigrations(knex, create))
    })
    .then(() => {
      return Promise.all(loadMigrations(knex, update))
    })
    .then(() => {
      return knex.raw('SET foreign_key_checks = 1;')
    })
}

export function down(knex, Promise) {
  return knex.raw('SET foreign_key_checks = 0;')
  .then(() => {
    return Promise.all(loadMigrations(knex, destroy))
  })
  .then(() => {
    return knex.raw('SET foreign_key_checks = 1;')
  })
}
