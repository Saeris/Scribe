import db from '../../config/bookshelf.config'
import Color from './color'

export default class ColorIdentity extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigIncrements(`id`)
         .notNullable()
         .primary()

    table.string(`name`)
         .comment(`The name of the color identity.`)
         .notNullable()

    table.string(`alias`)
         .comment(`The alias of the color identity. Examples: Bant, Jeskai`)

    table.bigInteger(`colors`)
         .comment(`List of colors included in this color identity.`)
         .notNullable()
         .unsigned()
         .index(`colorIdentity_colors`)

    table.boolean(`multicolored`)
         .comment(`True if the color identity has more than one color.`)
         .notNullable()

    table.boolean(`devoid`)
         .comment(`True if the color identity is ruled to be colorless.`)
         .notNullable()

    // Timestamps
    table.timestamps()
  }

  static foreignKeys(table) {
    table.foreign(`colors`)
         .references(`coloridentity`)
         .inTable(`colors`)
         .onDelete(`CASCADE`)
         .onUpdate(`NO ACTION`)
  }

  // Bookshelf Relation Definitions
  get tableName() { return 'colorIdentity' }

  get hasTimestamps() { return true }
}
