import db from '../config/bookshelf.config'

export default class supertype extends db.Model {
  get tableName() {
   return 'supertype'
  }

  static fields(table) {
    // Fields
    table.bigIncrements(`id`)
         .notNullable()
         .primary()

    table.string(`name`)
         .comment(`The name of the supertype.`)
         .notNullable()

    // Timestamps
    table.timestamps()
  }

  static foreignKeys(table) {

  }
}

export const Supertype = new supertype()
