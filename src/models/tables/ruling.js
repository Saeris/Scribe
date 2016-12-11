import db from '../../config/bookshelf.config'
import Card from './card'
import LanguageCode from './languageCode'

export default class Ruling extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Indexes
    table.bigIncrements(`id`)
         .notNullable()
         .primary()

    // Fields
    table.text(`text`)
         .comment(`The localized text of the ruling.`)
         .notNullable()

    table.date(`date`)
         .comment(`The date the ruling was issued.`)
         .notNullable()

    table.bigInteger(`language`)
         .comment(`The language code of this ruling.`)
         .notNullable()
         .unsigned()
         .index(`language`)

    table.bigInteger(`cards`)
         .comment(`List of cards that have this ruling.`)
         .notNullable()
         .unsigned()
         .index(`cards`)

    // Timestamps
    table.timestamps()
  }

  static foreignKeys(table) {
    table.foreign(`language`)
         .references(`id`)
         .inTable(`languagecode`)
         .onDelete(`NO ACTION`)
         .onUpdate(`NO ACTION`)

    table.foreign(`cards`)
         .references(`ruling`)
         .inTable(`rulingcards`)
         .onDelete(`CASCADE`)
         .onUpdate(`NO ACTION`)
  }

  // Bookshelf Relation Definitions
  get tableName() { return 'ruling' }

  get hasTimestamps() { return true }
}
