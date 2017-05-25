import db from '../../config/bookshelf.config'
import { Card, Language } from './'

export default class Name extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigIncrements(`id`)
      .notNullable()
      .unsigned()
      .primary()
      .unique()

    table.string(`name`)
      .comment(`The localized name of the card.`)
      .notNullable()

    table.bigInteger(`language`)
      .comment(`The language the name is localized in.`)
      .notNullable()
      .unsigned()

    table.bigInteger(`cards`)
      .comment(`A list of cards that have this name.`)
      .unsigned()

    // Timestamps
    table.timestamps()
  }

  // Bookshelf Relation Definitions
  get tableName() { return `name` }

  get hasTimestamps() { return true }

  cards = () => this.belongsTo(Card, `id`, `card`)

  language = () => this.hasOne(Language, `id`, `language`)
}
