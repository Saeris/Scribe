import db from '../../config/bookshelf.config'
import { LanguageCode } from './'

export default class Image extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigIncrements(`id`)
         .notNullable()
         .primary()

    table.string(`multiverseid`)
         .comment(`The multiverseid of the card on Wizard’s Gatherer web page. Cards from sets that do not exist on Gatherer will NOT have a multiverseid.`)
         .notNullable()

    table.text(`url`)
         .comment(`A URL pointing to an image of the card.`)
         .notNullable()

    table.bigInteger(`language`)
         .comment(`The language code of the language the image is localized in.`)
         .notNullable()
         .unsigned()
         .index(`image_language`)

    // Timestamps
    table.timestamps()
  }

  static foreignKeys(table) {
    table.foreign(`language`)
         .references(`id`)
         .inTable(`languagecode`)
         .onDelete(`NO ACTION`)
         .onUpdate(`NO ACTION`)
  }

  // Bookshelf Relation Definitions
  get tableName() { return `image` }

  get hasTimestamps() { return true }

  language = () => this.hasOne(LanguageCode, `language`)
}
