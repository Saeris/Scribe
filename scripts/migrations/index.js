import * as Types from "../../src/types"
import * as Junctions from "../../src/junctions"

const { log, error } = console

const create = knex => {
  const types = Object.values(Types)
    .filter(type => !!type.Definition)
    .map(type => type.Definition)
    .map(({ _typeConfig: { sqlTable: name, fields } }) => {
      try {
        return knex.schema.createTableIfNotExists(name, table => {
          table.timestamp(`created`).defaultTo(knex.fn.now())
          table.timestamp(`updated`).defaultTo(knex.fn.now())
          table.timestamp(`deleted`).defaultTo(null)
          table.boolean(`active`).defaultTo(true)
          Object.values(fields(true)).filter(field => !!field.column).forEach(field => field.column(table))
          table.primary([`id`, `active`])
          log(`Created table: ${name}`)
        })
      } catch (err) {
        error(`Failed to create table: ${name}`, err)
        return false
      }
    })

  const junctions = Object.values(Junctions)
    .filter(migration => (!!migration.fields || !!migration.foreignKeys))
    .map(({ name, fields }) => {
      try {
        return knex.schema.createTableIfNotExists(name, table => {
          table.boolean(`active`).defaultTo(true)
          table.timestamp(`created`).defaultTo(knex.fn.now())
          table.timestamp(`updated`).defaultTo(knex.fn.now())
          table.timestamp(`deleted`).defaultTo(null)
          fields(table)
          log(`Created table: ${name}`)
        })
      } catch (err) {
        error(`Failed to create table: ${name}`, err)
        return false
      }
    })

  return [...types, ...junctions]
}

const destroy = knex => {
  const types = Object.values(Types)
    .filter(type => !!type.Definition)
    .map(type => type.Definition)
    .map(async ({ _typeConfig: { sqlTable: name, fields } }) => {
      try {
        const result = await knex.schema.dropTableIfExists(name)
        log(`Destroyed table: ${name}`)
        return result
      } catch (err) {
        error(`Failed to destroy table: ${name}`, err)
        return false
      }
    })

  const junctions = Object.values(Junctions)
    .filter(migration => (!!migration.fields || !!migration.foreignKeys))
    .map(async ({ name, fields }) => {
      try {
        const result = await knex.schema.dropTableIfExists(name)
        log(`Created table: ${name}`)
        return result
      } catch (err) {
        error(`Failed to create table: ${name}`, err)
        return false
      }
    })

  return [...types, ...junctions]
}

// http://knexjs.org/#Migrations-API

export const up = (knex, Promise) => Promise.all(create(knex)) // eslint-disable-line

export const down = (knex, Promise) => Promise.all(destroy(knex)) // eslint-disable-line
