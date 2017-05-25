import db from '../../config/bookshelf.config'
import { Card, LanguageCode } from './'

export default class Keyword extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigIncrements(`id`)
         .notNullable()
         .unsigned()
         .primary()
         .unique()

    table.string(`name`)
         .comment(`The name of the keyword.`)
         .notNullable()
         .unique()

    table.text(`reminderText`)
         .comment(`A short description of the keyword rules.`)

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

  // Bookshelf Relation Definitions
  get tableName() { return `keyword` }

  get hasTimestamps() { return true }

  languageCode = () => this.hasOne(LanguageCode, `languageCode`)

  cards = () => this.belongsToMany(Card, `cards`)
}
