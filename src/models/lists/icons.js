import db from '../../config/bookshelf.config'

export default class Icons extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigInteger(`layout`)
         .comment(`The layout associated with this icon.`)
         .notNullable()
         .unsigned()
         .index(`icons_layout`)

    table.bigInteger(`icon`)
         .comment(`The icon associated with this layout.`)
         .notNullable()
         .unsigned()
         .index(`icons_icon`)

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`layout`, `icon`])
  }

  static foreignKeys(table) {
    table.foreign(`icon`)
         .references(`id`)
         .inTable(`icon`)
         .onDelete(`NO ACTION`)
         .onUpdate(`NO ACTION`)
  }

  // Bookshelf Relation Definitions
  get tableName() { return `icons` }

  get hasTimestamps() { return true }
}
