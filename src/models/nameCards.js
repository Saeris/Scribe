import db from '../config/bookshelf.config'

export default class nameCards extends db.Model {
  get tableName() {
   return 'namecards'
  }

  static fields(table) {
    // Fields
    table.bigInteger(`name`)
         .comment(`The name associated with this card.`)
         .notNullable()
         .unsigned()
         .index(`name`)

    table.bigInteger(`card`)
         .comment(`The card associated with this name.`)
         .notNullable()
         .unsigned()
         .index(`card`)

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`name`, `card`])
  }

  static foreignKeys(table) {
    table.foreign(`card`)
         .references(`id`)
         .inTable(`card`)
         .onDelete(`NO ACTION`)
         .onUpdate(`NO ACTION`)
  }
}

export const NameCards = new nameCards()
