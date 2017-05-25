import db from '../../config/bookshelf.config'

export default class KeywordCards extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigInteger(`keyword`)
      .comment(`The keyword associated with this card.`)
      .notNullable()
      .unsigned()

    table.bigInteger(`card`)
      .comment(`The card associated with this keyword.`)
      .notNullable()
      .unsigned()

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`keyword`, `card`])
  }

  // Bookshelf Relation Definitions
  get tableName() { return `keywordcards` }

  get hasTimestamps() { return true }
}
