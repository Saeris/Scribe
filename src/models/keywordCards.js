import db from '../config/bookshelf.config'

export default class keywordCards extends db.Model {
  get tableName() {
   return 'keywordcards'
  }

  static fields(table) {
    // Fields
    table.bigInteger(`keyword`)
         .comment(`The keyword associated with this card.`)
         .notNullable()
         .unsigned()
         .index(`keyword`)

    table.bigInteger(`card`)
         .comment(`The card associated with this keyword.`)
         .notNullable()
         .unsigned()
         .index(`card`)

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`keyword`, `card`])
  }

  static foreignKeys(table) {
    table.foreign(`card`)
         .references(`id`)
         .inTable(`card`)
         .onDelete(`NO ACTION`)
         .onUpdate(`NO ACTION`)
  }
}

export const KewordCards = new keywordCards()
