import db from '../config/bookshelf.config'

export default class sides extends db.Model {
  get tableName() {
   return 'sides'
  }

  static fields(table) {
    // Fields
    table.bigInteger(`card`)
         .comment(`The card associated with this side.`)
         .notNullable()
         .unsigned()
         .index(`card`)

    table.bigInteger(`side`)
         .comment(`The side associated with this card.`)
         .notNullable()
         .unsigned()
         .index(`side`)

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`card`, `side`])
  }

  static foreignKeys(table) {
    table.foreign(`side`)
         .references(`id`)
         .inTable(`card`)
         .onDelete(`NO ACTION`)
         .onUpdate(`NO ACTION`)
  }
}

export const Sides = new sides()
