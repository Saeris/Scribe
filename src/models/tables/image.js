import db from '../../config/bookshelf.config'
import { Language } from './'

export default class Image extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigIncrements(`id`)
      .notNullable()
      .unsigned()
      .primary()
      .unique()

    table.string(`multiverseid`)
      .comment(`The multiverseid of the printing on Wizard’s Gatherer web page. Cards from sets that do not exist on Gatherer will NOT have a multiverseid.`)
      .notNullable()
      .unique()

    table.text(`url`)
      .comment(`A URL pointing to an image of the card.`)
      .notNullable()

    table.bigInteger(`language`)
      .comment(`The language the image is localized in.`)
      .notNullable()
      .unsigned()

    // Timestamps
    table.timestamps()
  }

  // Bookshelf Relation Definitions
  get tableName() { return `image` }

  get hasTimestamps() { return true }

  language = () => this.hasOne(Language, `language`)
}
