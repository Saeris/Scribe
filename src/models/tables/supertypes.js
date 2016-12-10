import db from '../../config/bookshelf.config'

export default class supertypes extends db.Model {
  get tableName() {
   return 'supertypes'
  }

  static fields(table) {
    // Fields
    table.bigInteger(`card`)
         .comment(`The card associated with this supertype.`)
         .notNullable()
         .unsigned()
         .index(`supertypes_card`)

    table.bigInteger(`supertype`)
         .comment(`The supertype associated with this card.`)
         .notNullable()
         .unsigned()
         .index(`supertypes_supertype`)

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`card`, `supertype`])
  }

  static foreignKeys(table) {
    table.foreign(`supertype`)
         .references(`id`)
         .inTable(`supertype`)
         .onDelete(`NO ACTION`)
         .onUpdate(`NO ACTION`)
  }
}

export const Supertypes = new supertypes()
