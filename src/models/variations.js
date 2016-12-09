import db from '../config/bookshelf.config'

export default class variations extends db.Model {
  get tableName() {
   return 'variations'
  }

  static fields(table) {
    // Fields
    table.bigInteger(`card`)
         .comment(`The card associated with this variation.`)
         .notNullable()
         .unsigned()
         .index(`card`)

    table.bigInteger(`variation`)
         .comment(`The variation associated with this card.`)
         .notNullable()
         .unsigned()
         .index(`variation`)

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`card`, `variation`])
  }

  static foreignKeys(table) {
      table.foreign(`variation`)
           .references(`id`)
           .inTable(`card`)
           .onDelete(`NO ACTION`)
           .onUpdate(`NO ACTION`)
  }
}

export const Variations = new variations()
