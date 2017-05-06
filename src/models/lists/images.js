import db from '../../config/bookshelf.config'

export default class Images extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigInteger(`card`)
         .comment(`The card associated with this image.`)
         .notNullable()
         .unsigned()
         .index(`images_card`)

    table.bigInteger(`image`)
         .comment(`The image associated with this card.`)
         .notNullable()
         .unsigned()
         .index(`images_image`)

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`card`, `image`])
  }

  static foreignKeys(table) {
    table.foreign(`image`)
         .references(`id`)
         .inTable(`image`)
         .onDelete(`NO ACTION`)
         .onUpdate(`NO ACTION`)
  }

  // Bookshelf Relation Definitions
  get tableName() { return `images` }

  get hasTimestamps() { return true }
}
