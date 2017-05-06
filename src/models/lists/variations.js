import db from '../../config/bookshelf.config'

export default class Variations extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigInteger(`card`)
         .comment(`The card associated with this variation.`)
         .notNullable()
         .unsigned()
         .index(`variations_card`)

    table.bigInteger(`variation`)
         .comment(`The variation associated with this card.`)
         .notNullable()
         .unsigned()
         .index(`variations_variation`)

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`card`, `variation`])
  }

  static foreignKeys(table) {
    table.foreign(`variation`)
         .references(`id`)
         .inTable(`card`)
         .onDelete(`NO ACTION`)
         .onUpdate(`NO ACTION`)
  }

  // Bookshelf Relation Definitions
  get tableName() { return `variations` }

  get hasTimestamps() { return true }
}
