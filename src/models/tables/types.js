import db from '../../config/bookshelf.config'

export default class types extends db.Model {
  get tableName() {
   return 'types'
  }

  static fields(table) {
    // Fields
    table.bigInteger(`card`)
         .comment(`The card associated with this type.`)
         .notNullable()
         .unsigned()
         .index(`types_card`)

    table.bigInteger(`type`)
         .comment(`The type associated with this card.`)
         .notNullable()
         .unsigned()
         .index(`types_type`)

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`card`, `type`])
  }

  static foreignKeys(table) {
    table.foreign(`type`)
         .references(`id`)
         .inTable(`type`)
         .onDelete(`NO ACTION`)
         .onUpdate(`NO ACTION`)
  }
}

export const Types = new types()
