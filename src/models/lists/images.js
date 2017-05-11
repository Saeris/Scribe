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

    table.bigInteger(`artist`)
         .comment(`The artist associated with this image.`)
         .notNullable()
         .unsigned()
         .index(`images_artist`)

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`card`, `image`, `artist`])
  }

  // Bookshelf Relation Definitions
  get tableName() { return `images` }

  get hasTimestamps() { return true }
}
