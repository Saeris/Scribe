import db from '../../config/bookshelf.config'
import { bookshelfOptions } from '../../utilities'
import { Card, Language } from './'

@bookshelfOptions
export default class Ruling extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Indexes
    table.string(`id`)
      .notNullable()
      .primary()
      .unique()

    // Fields
    table.text(`text`)
      .comment(`The localized text of the ruling.`)
      .notNullable()

    table.date(`date`)
      .comment(`The date the ruling was issued.`)
      .notNullable()

    table.string(`language`)
      .comment(`The language this ruling is localized in.`)
      .notNullable()

    // Timestamps
    table.timestamps()
  }

  language = () => this.hasOne(Language, `language`)

  cards = () => this.hasMany(Card, `id`).through(RulingCards, `id`, `card`, `ruling`)
}
