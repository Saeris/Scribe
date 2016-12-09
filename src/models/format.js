import db from '../config/bookshelf.config'

export default class format extends db.Model {
  get tableName() {
   return 'format'
  }

  static fields(table) {
    // Fields
    table.bigIncrements(`id`)
         .notNullable()
         .primary()

    table.string(`name`)
         .comment(`The name of the format.`)
         .notNullable()

    table.bigInteger(`sets`)
         .comment(`List of sets that are included in this format.`)
         .notNullable()
         .unsigned()
         .index(`sets`)

    // Timestamps
    table.timestamps()
  }

  static foreignKeys(table) {
    table.foreign(`sets`)
         .references(`format`)
         .inTable(`formatSets`)
         .onDelete(`CASCADE`)
         .onUpdate(`NO ACTION`)
  }
}

export const Format = new format()
