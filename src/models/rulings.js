import db from '../config/bookshelf.config'

export default class rulings extends db.Model {
  get tableName() {
   return 'rulings'
  }

  static fields(table) {
    // Fields
    table.bigInteger(`card`)
         .comment(`The card associated with this ruling.`)
         .notNullable()
         .unsigned()
         .index(`card`)

    table.bigInteger(`ruling`)
         .comment(`The ruling associated with this card.`)
         .notNullable()
         .unsigned()
         .index(`ruling`)

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`card`, `ruling`])
  }

  static foreignKeys(table) {
    table.foreign(`ruling`)
         .references(`id`)
         .inTable(`ruling`)
         .onDelete(`NO ACTION`)
         .onUpdate(`NO ACTION`)
  }
}

export const Rulings = new rulings()
