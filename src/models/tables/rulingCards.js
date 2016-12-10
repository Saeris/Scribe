import db from '../../config/bookshelf.config'

export default class rulingCards extends db.Model {
  get tableName() {
   return 'rulingcards'
  }

  static fields(table) {
    // Fields
    table.bigInteger(`ruling`)
         .comment(`The ruling associated with this card.`)
         .notNullable()
         .unsigned()
         .index(`rulingCards_ruling`)

    table.bigInteger(`card`)
         .comment(`The card associated with this ruling.`)
         .notNullable()
         .unsigned()
         .index(`rulingCards_card`)

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`ruling`, `card`])
  }

  static foreignKeys(table) {
    table.foreign(`card`)
         .references(`id`)
         .inTable(`card`)
         .onDelete(`NO ACTION`)
         .onUpdate(`NO ACTION`)
  }
}

export const RulingCards = new rulingCards()
