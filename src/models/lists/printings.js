import db from '../../config/bookshelf.config'

export default class Printings extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigInteger(`card`)
         .comment(`The card associated with this printing.`)
         .notNullable()
         .unsigned()
         .index(`printings_card`)

    table.bigInteger(`set`)
         .comment(`The set associated with this printing.`)
         .notNullable()
         .unsigned()
         .index(`printings_set`)

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`card`, `set`])
  }

  static foreignKeys(table) {
    table.foreign(`set`)
         .references(`id`)
         .inTable(`set`)
         .onDelete(`NO ACTION`)
         .onUpdate(`NO ACTION`)
  }

  // Bookshelf Relation Definitions
  get tableName() { return `printings` }

  get hasTimestamps() { return true }
}
