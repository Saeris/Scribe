import db from '../../config/bookshelf.config'
import { Card, Language } from './'

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

    table.bigInteger(`language`)
      .comment(`The language the reminder text of keyword is localized in.`)
      .notNullable()
      .unsigned()

    table.bigInteger(`cards`)
      .comment(`A list of cards that have this keyword.`)
      .notNullable()
      .unsigned()

    // Timestamps
    table.timestamps()
  }

  // Bookshelf Relation Definitions
  get tableName() { return `keyword` }

  get hasTimestamps() { return true }

  language = () => this.hasOne(Language, `language`)

  cards = () => this.belongsToMany(Card, `cards`)
}
