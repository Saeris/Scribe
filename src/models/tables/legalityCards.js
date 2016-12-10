import db from '../../config/bookshelf.config'

export default class legalityCards extends db.Model {
  get tableName() {
   return 'legalitycards'
  }

  static fields(table) {
    // Fields
    table.bigInteger(`legality`)
         .comment(`The legality associated with this card.`)
         .notNullable()
         .unsigned()
         .index(`legalityCards_legality`)

    table.bigInteger(`card`)
         .comment(`The card associated with this legality.`)
         .notNullable()
         .unsigned()
         .index(`legalityCards_card`)

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`legality`, `card`])
  }

  static foreignKeys(table) {
    table.foreign(`card`)
         .references(`id`)
         .inTable(`card`)
         .onDelete(`NO ACTION`)
         .onUpdate(`NO ACTION`)
  }
}

export const LegalityCards = new legalityCards()
