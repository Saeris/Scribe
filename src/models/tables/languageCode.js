import db from '../../config/bookshelf.config'
import Language from './language'

export default class LanguageCode extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigIncrements(`id`)
         .notNullable()
         .primary()

    table.string(`code`)
         .comment(`The language code.`)
         .notNullable()

    table.bigInteger(`language`)
         .comment(`The language associated with the language code.`)
         .notNullable()
         .unsigned()
         .index(`languagecode_language`)

    // Timestamps
    table.timestamps()
  }

  static foreignKeys(table) {
    table.foreign(`language`)
         .references(`id`)
         .inTable(`language`)
         .onDelete(`NO ACTION`)
         .onUpdate(`NO ACTION`)
  }

  // Bookshelf Relation Definitions
  get tableName() { return 'languagecode' }

  get hasTimestamps() { return true }
}
