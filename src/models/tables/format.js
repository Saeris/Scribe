import db from '../../config/bookshelf.config'
import { Set } from './'

export default class Format extends db.Model {
  // Knex Schema Definitions
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
         .index(`format_sets`)

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

  // Bookshelf Relation Definitions
  get tableName() { return `format` }

  get hasTimestamps() { return true }

  sets = () => this.hasMany(Set, `sets`)
}
