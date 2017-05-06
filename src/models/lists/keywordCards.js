import db from '../../config/bookshelf.config'

export default class KeywordCards extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigInteger(`keyword`)
         .comment(`The keyword associated with this card.`)
         .notNullable()
         .unsigned()
         .index(`keywordcards_keyword`)

    table.bigInteger(`card`)
         .comment(`The card associated with this keyword.`)
         .notNullable()
         .unsigned()
         .index(`keywordcards_card`)

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`keyword`, `card`])
  }

  static foreignKeys(table) {
    table.foreign(`card`)
         .references(`id`)
         .inTable(`card`)
         .onDelete(`NO ACTION`)
         .onUpdate(`NO ACTION`)
  }

  // Bookshelf Relation Definitions
  get tableName() { return `keywordcards` }

  get hasTimestamps() { return true }
}
