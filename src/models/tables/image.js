import db from '../../config/bookshelf.config'
import { bookshelfOptions } from '../../utilities'
import { Language } from './'

@bookshelfOptions
export default class Image extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.string(`id`)
      .notNullable()
      .primary()
      .unique()

    table.string(`multiverseid`)
      .comment(`The multiverseid of the printing on Wizard’s Gatherer web page. Cards from sets that do not exist on Gatherer will NOT have a multiverseid.`)
      .notNullable()
      .unique()

    table.text(`url`)
      .comment(`A URL pointing to an image of the card.`)
      .notNullable()

    table.string(`language`)
      .comment(`The language the image is localized in.`)
      .notNullable()

    // Timestamps
    table.timestamps()
  }

  language = () => this.hasOne(Language, `language`)
}
