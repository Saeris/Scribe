import db from '../../config/bookshelf.config'

export default class legalities extends db.Model {
  get tableName() {
   return 'legalities'
  }

  static fields(table) {
    // Fields
    table.bigInteger(`card`)
         .comment(`The card associated with this legality.`)
         .notNullable()
         .unsigned()
         .index(`legalities_card`)

    table.bigInteger(`legality`)
         .comment(`The legality associated with this card.`)
         .notNullable()
         .unsigned()
         .index(`legalities_legality`)

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`card`, `legality`])
  }

  static foreignKeys(table) {
    table.foreign(`legality`)
         .references(`id`)
         .inTable(`legality`)
         .onDelete(`NO ACTION`)
         .onUpdate(`NO ACTION`)
  }
}

export const Legalities = new legalities()
