import db from '../../config/bookshelf.config'

export default class type extends db.Model {
  get tableName() {
   return 'type'
  }

  static fields(table) {
    // Fields
    table.bigIncrements(`id`)
         .notNullable()
         .primary()

    table.string(`name`)
         .comment(`The name of the type.`)
         .notNullable()

    // Timestamps
    table.timestamps()
  }

  static foreignKeys(table) {

  }
}

export const Type = new type()
