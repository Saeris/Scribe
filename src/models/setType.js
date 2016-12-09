import db from '../config/bookshelf.config'

export default class setType extends db.Model {
  get tableName() {
   return 'setType'
  }

  static fields(table) {
    // Fields
    table.bigIncrements(`id`)
         .notNullable()
         .primary()

    table.string(`name`)
         .comment(`The name of the set type.`)
         .notNullable()

    table.text(`description`)
         .comment(`The description of the set type.`)

    // Timestamps
    table.timestamps()
  }

  static foreignKeys(table) {

  }
}

export const SetType = new setType()
