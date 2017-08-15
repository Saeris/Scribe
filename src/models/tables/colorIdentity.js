import db from '../../config/bookshelf.config'
import { bookshelfOptions } from '../../utilities'
import { Color } from './'
import { Colors } from '../lists'

@bookshelfOptions
export default class ColorIdentity extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.string(`id`)
      .notNullable()
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

  colors = () => this.hasMany(Color, `id`).through(Colors, `id`, `colorIdentity`, `color`)
}
