import db from '../../config/bookshelf.config'

export default class BlockSets extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigInteger(`block`)
      .comment(`The block associated with this set.`)
      .notNullable()
      .unsigned()

    table.bigInteger(`set`)
      .comment(`The set associated with this block.`)
      .notNullable()
      .unsigned()

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`block`, `set`])
  }

  // Bookshelf Relation Definitions
  get tableName() { return `blocksets` }

  get hasTimestamps() { return true }
}
