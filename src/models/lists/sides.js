import db from '../../config/bookshelf.config'

export default class Sides extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigInteger(`card`)
         .comment(`The card associated with this side.`)
         .notNullable()
         .unsigned()
         .index(`card`)

    table.bigInteger(`side`)
         .comment(`The side associated with this card.`)
         .notNullable()
         .unsigned()
         .index(`side`)

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`card`, `side`])
  }

  static foreignKeys(table) {
    table.foreign(`side`)
         .references(`id`)
         .inTable(`card`)
         .onDelete(`NO ACTION`)
         .onUpdate(`NO ACTION`)
  }

  // Bookshelf Relation Definitions
  get tableName() { return 'sides' }

  get hasTimestamps() { return true }
}
