import db from '../config/bookshelf.config'

export default class categoryCards extends db.Model {
  get tableName() {
   return 'categorycards'
  }

  static fields(table) {
    // Fields
    table.bigInteger(`category`)
         .comment(`The category associated with this card.`)
         .notNullable()
         .unsigned()
         .index(`category`)

    table.bigInteger(`card`)
         .comment(`The card associated with this category.`)
         .notNullable()
         .unsigned()
         .index(`card`)

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`category`, `card`])
  }

  static foreignKeys(table) {
    table.foreign(`card`)
         .references(`id`)
         .inTable(`card`)
         .onDelete(`NO ACTION`)
         .onUpdate(`NO ACTION`)
  }
}

export const CategoryCards = new categoryCards()
