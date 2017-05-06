import db from '../../config/bookshelf.config'

export default class Rulings extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigInteger(`card`)
         .comment(`The card associated with this ruling.`)
         .notNullable()
         .unsigned()
         .index(`rulings_card`)

    table.bigInteger(`ruling`)
         .comment(`The ruling associated with this card.`)
         .notNullable()
         .unsigned()
         .index(`rulings_ruling`)

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`card`, `ruling`])
  }

  static foreignKeys(table) {
    table.foreign(`ruling`)
         .references(`id`)
         .inTable(`ruling`)
         .onDelete(`NO ACTION`)
         .onUpdate(`NO ACTION`)
  }

  // Bookshelf Relation Definitions
  get tableName() { return `rulings` }

  get hasTimestamps() { return true }
}
