import db from '../config/bookshelf.config'

export default class names extends db.Model {
  get tableName() {
   return 'names'
  }

  static fields(table) {
    // Fields
    table.bigInteger(`card`)
         .comment(`The card associated with this name.`)
         .notNullable()
         .unsigned()
         .index(`card`)

    table.bigInteger(`name`)
         .comment(`The name associated with this card.`)
         .notNullable()
         .unsigned()
         .index(`name`)

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`card`, `name`])
  }

  static foreignKeys(table) {
    table.foreign(`name`)
         .references(`id`)
         .inTable(`name`)
         .onDelete(`NO ACTION`)
         .onUpdate(`NO ACTION`)
  }
}

export const Names = new names()
