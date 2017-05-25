import db from '../../config/bookshelf.config'
import { Language } from './'

export default class LanguageCode extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigIncrements(`id`)
         .notNullable()
         .unsigned()
         .primary()
         .unique()

    table.string(`code`)
         .comment(`The language code.`)
         .notNullable()
         .unique()

    table.bigInteger(`language`)
         .comment(`The language associated with the language code.`)
         .notNullable()
         .unsigned()
         .index(`languagecode_language`)

    // Timestamps
    table.timestamps()
  }

  // Bookshelf Relation Definitions
  get tableName() { return `languagecode` }

  get hasTimestamps() { return true }

  language = () => this.belongsTo(Language, `language`)
}
