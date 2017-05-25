import db from '../../config/bookshelf.config'
import { Color } from './'
import { Colors } from '../lists'

export default class ColorIdentity extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigIncrements(`id`)
         .notNullable()
         .unsigned()
         .primary()
         .unique()

    table.string(`name`)
         .comment(`The name of the color identity.`)
         .notNullable()
         .unique()

    table.string(`alias`)
         .comment(`The alias of the color identity. Examples: Bant, Jeskai`)

    table.boolean(`multicolored`)
         .comment(`True if the color identity has more than one color.`)
         .notNullable()

    table.boolean(`devoid`)
         .comment(`True if the color identity is ruled to be colorless.`)
         .notNullable()

    // Timestamps
    table.timestamps()
  }

  // Bookshelf Relation Definitions
  get tableName() { return `colorIdentity` }

  get hasTimestamps() { return true }

  colors = () => this.hasMany(Color, `id`).through(Colors, `id`, `coloridentity`, `color`)
}
