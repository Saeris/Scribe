import db from '../../config/bookshelf.config'
import { bookshelfOptions } from '../../utilities'
import { Card, Language } from './'

@bookshelfOptions
export default class Name extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.string(`id`)
      .notNullable()
      .primary()
      .unique()

    table.string(`name`)
      .comment(`The localized name of the card.`)
      .notNullable()

    table.string(`language`)
      .comment(`The language the name is localized in.`)
      .notNullable()

    // Timestamps
    table.timestamps()
  }

  cards = () => this.belongsTo(Card, `id`, `card`)

  language = () => this.hasOne(Language, `id`, `language`)
}
