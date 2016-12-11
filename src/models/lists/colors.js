import db from '../../config/bookshelf.config'

export default class Colors extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigInteger(`coloridentity`)
         .comment(`The colorIdentity associated with the color.`)
         .notNullable()
         .unsigned()
         .index(`coloridentity`)

    table.bigInteger(`color`)
         .comment(`The color associated with the colorIdentity.`)
         .notNullable()
         .unsigned()
         .index(`color`)

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`coloridentity`, `color`])
  }

  static foreignKeys(table) {
      table.foreign(`color`)
           .references(`id`)
           .inTable(`color`)
           .onDelete(`NO ACTION`)
           .onUpdate(`NO ACTION`)
  }

  // Bookshelf Relation Definitions
  get tableName() { return 'colors' }

  get hasTimestamps() { return true }
}
