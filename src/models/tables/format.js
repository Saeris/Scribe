import db from '../../config/bookshelf.config'
import { Set } from './'

export default class Format extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigIncrements(`id`)
         .notNullable()
         .unsigned()
         .primary()
         .unique()

    table.string(`name`)
         .comment(`The name of the format.`)
         .notNullable()
         .unique()

    table.bigInteger(`sets`)
         .comment(`List of sets that are included in this format.`)
         .notNullable()
         .unsigned()
         .index(`format_sets`)

    // Timestamps
    table.timestamps()
  }

  // Bookshelf Relation Definitions
  get tableName() { return `format` }

  get hasTimestamps() { return true }

  sets = () => this.hasMany(Set, `sets`)
}
