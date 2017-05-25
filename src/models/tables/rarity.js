import db from '../../config/bookshelf.config'

export default class Rarity extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigIncrements(`id`)
         .notNullable()
         .unsigned()
         .primary()
         .unique()

    table.string(`name`)
         .comment(`The name of the rarity.`)
         .notNullable()
         .unique()

    table.string(`class`)
         .comment(`CSS class name used to display the rarity.`)
         .notNullable()

    // Timestamps
    table.timestamps()
  }

  // Bookshelf Relation Definitions
  get tableName() { return `rarity` }

  get hasTimestamps() { return true }
}
