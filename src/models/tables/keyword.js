import db from '../../config/bookshelf.config'
import { bookshelfOptions } from '../../utilities'
import { Card, Language } from './'

@bookshelfOptions
export default class Keyword extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.string(`id`)
      .notNullable()
      .primary()
      .unique()

    table.string(`name`)
      .comment(`The name of the keyword.`)
      .notNullable()
      .unique()

    table.text(`reminderText`)
      .comment(`A short description of the keyword rules.`)

    table.string(`language`)
      .comment(`The language the reminder text of keyword is localized in.`)
      .notNullable()

    // Timestamps
    table.timestamps()
  }

  language = () => this.hasOne(Language, `language`)

  cards = () => this.belongsToMany(Card, `cards`)
}
