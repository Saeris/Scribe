import db from '../config/bookshelf.config'

export default class rarity extends db.Model {
  get tableName() {
   return 'rarity'
  }

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
}

export const Rarity = new rarity()
