import db from '../../config/bookshelf.config'

export default class Rarity extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigIncrements(`id`)
         .notNullable()
         .primary()

    table.string(`name`)
         .comment(`The name of the rarity.`)
         .notNullable()

    table.string(`class`)
         .comment(`CSS class name used to display the rarity.`)
         .notNullable()

    // Timestamps
    table.timestamps()
  }

  static foreignKeys(table) {

  }

  // Bookshelf Relation Definitions
  get tableName() { return `rarity` }

  get hasTimestamps() { return true }
}
