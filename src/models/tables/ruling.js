import db from '../../config/bookshelf.config'
import { Card, Language } from './'

export default class Ruling extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Indexes
    table.bigIncrements(`id`)
      .notNullable()
      .unsigned()
      .primary()
      .unique()

    // Fields
    table.text(`text`)
      .comment(`The localized text of the ruling.`)
      .notNullable()

    table.date(`date`)
      .comment(`The date the ruling was issued.`)
      .notNullable()

    table.bigInteger(`language`)
      .comment(`The language this ruling is localized in.`)
      .notNullable()
      .unsigned()

    // Timestamps
    table.timestamps()
  }

  // Bookshelf Relation Definitions
  get tableName() { return `ruling` }

  get hasTimestamps() { return true }

  language = () => this.hasOne(Language, `language`)

  cards = () => this.hasMany(Card, `id`).through(RulingCards, `id`, `card`, `ruling`)
}
