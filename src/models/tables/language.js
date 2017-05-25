import db from '../../config/bookshelf.config'
import { LanguageCode } from './'

export default class Language extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigIncrements(`id`)
         .notNullable()
         .unsigned()
         .primary()
         .unique()

    table.string(`name`)
         .comment(`The name of the language.`)
         .notNullable()
         .unique()

    table.bigInteger(`code`)
         .comment(`The language code associated with this language.`)
         .notNullable()
         .unsigned()
         .index(`language_code`)

    // Timestamps
    table.timestamps()
  }

  // Bookshelf Relation Definitions
  get tableName() { return `language` }

  get hasTimestamps() { return true }

  code = () => this.hasOne(LanguageCode, `id`, `code`)
}
