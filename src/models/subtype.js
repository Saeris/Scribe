import db from '../config/bookshelf.config'

export default class subtype extends db.Model {
  get tableName() {
   return 'subtype'
  }

  static fields(table) {
    // Fields
    table.bigIncrements(`id`)
         .notNullable()
         .primary()

    table.string(`name`)
         .comment(`The name of the subtype.`)
         .notNullable()

    // Timestamps
    table.timestamps()
  }

  static foreignKeys(table) {

  }
}

export const Subtype = new subtype()
