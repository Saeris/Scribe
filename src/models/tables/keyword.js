import db from '../../config/bookshelf.config'
import Card from './card'
import LanguageCode from './languageCode'

export default class Keyword extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigIncrements(`id`)
         .notNullable()
         .primary()

    table.string(`name`)
         .comment(`The name of the keyword.`)
         .notNullable()

    table.text(`reminderText`)
         .comment(`A short description of the keyword ability's rules.`)

    table.bigInteger(`languageCode`)
         .comment(`The language code the reminder text of keyword is localized in.`)
         .notNullable()
         .unsigned()
         .index(`keyword_code`)

    table.bigInteger(`cards`)
         .comment(`A list of cards that have this keyword.`)
         .notNullable()
         .unsigned()
         .index(`keyword_cards`)

    // Timestamps
    table.timestamps()
  }

  static foreignKeys(table) {
    table.foreign(`cards`)
         .references(`keyword`)
         .inTable(`keywordcards`)
         .onDelete(`CASCADE`)
         .onUpdate(`NO ACTION`)
  }

  // Bookshelf Relation Definitions
  get tableName() { return 'keyword' }

  get hasTimestamps() { return true }
}
