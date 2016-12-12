import db from '../../config/bookshelf.config'

export default class Keywords extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigInteger(`card`)
         .comment(`The card associated with this keyword.`)
         .notNullable()
         .unsigned()
         .index(`card`)

    table.bigInteger(`keyword`)
         .comment(`The keyword associated with this card.`)
         .notNullable()
         .unsigned()
         .index(`keyword`)

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`card`, `keyword`])
  }

  static foreignKeys(table) {
    table.foreign(`keyword`)
         .references(`id`)
         .inTable(`keyword`)
         .onDelete(`NO ACTION`)
         .onUpdate(`NO ACTION`)
  }

  // Bookshelf Relation Definitions
  get tableName() { return `keywords` }

  get hasTimestamps() { return true }
}
