import db from '../../config/bookshelf.config'

export default class subtypes extends db.Model {
  get tableName() {
   return 'subtypes'
  }

  static fields(table) {
    // Fields
    table.bigInteger(`card`)
         .comment(`The card associated with this subtype.`)
         .notNullable()
         .unsigned()
         .index(`subtypes_card`)

    table.bigInteger(`subtype`)
         .comment(`The subtype associated with this card.`)
         .notNullable()
         .unsigned()
         .index(`subtypes_subtype`)

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`card`, `subtype`])
  }

  static foreignKeys(table) {
    table.foreign(`subtype`)
         .references(`id`)
         .inTable(`subtype`)
         .onDelete(`NO ACTION`)
         .onUpdate(`NO ACTION`)
  }
}

export const Subtypes = new subtypes()
