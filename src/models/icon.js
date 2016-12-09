import db from '../config/bookshelf.config'

export default class icon extends db.Model {
  get tableName() {
   return 'icon'
  }

  static fields(table) {
    // Fields
    table.bigIncrements(`id`)
         .notNullable()
         .primary()

    table.string(`name`)
         .comment(`The name of the icon.`)
         .notNullable()

    table.text(`image`)
         .comment(`A URL pointing to an image of the icon.`)
         .notNullable()

    table.string(`class`)
         .comment(`CSS class name used to display the icon.`)
         .notNullable()

    // Timestamps
    table.timestamps()
  }

  static foreignKeys(table) {

  }
}

export const Icon = new icon()
