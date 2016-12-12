import db from '../../config/bookshelf.config'

export default class CategoryCards extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigInteger(`category`)
         .comment(`The category associated with this card.`)
         .notNullable()
         .unsigned()
         .index(`category`)

    table.bigInteger(`card`)
         .comment(`The card associated with this category.`)
         .notNullable()
         .unsigned()
         .index(`card`)

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`category`, `card`])
  }

  static foreignKeys(table) {
    table.foreign(`card`)
         .references(`id`)
         .inTable(`card`)
         .onDelete(`NO ACTION`)
         .onUpdate(`NO ACTION`)
  }

  // Bookshelf Relation Definitions
  get tableName() { return `categorycards` }

  get hasTimestamps() { return true }
}
