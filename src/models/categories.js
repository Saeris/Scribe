import db from '../config/bookshelf.config'

export default class categories extends db.Model {
  get tableName() {
   return 'categories'
  }

  static fields(table) {
    // Fields
    table.bigInteger(`card`)
         .comment(`The card associated with this category.`)
         .notNullable()
         .unsigned()
         .index(`card`)

    table.bigInteger(`category`)
         .comment(`The category associated with this card.`)
         .notNullable()
         .unsigned()
         .index(`category`)

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`card`, `category`])
  }

  static foreignKeys(table) {
    table.foreign(`category`)
         .references(`id`)
         .inTable(`category`)
         .onDelete(`NO ACTION`)
         .onUpdate(`NO ACTION`)
  }
}

export const Categories = new categories()
