import db from '../../config/bookshelf.config'
import { bookshelfOptions } from '../../utilities'
import { Icon, ColorIdentity } from './'
import { Colors } from '../lists'

@bookshelfOptions
export default class Color extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.string(`id`)
      .notNullable()
      .primary()
      .unique()

    table.string(`symbol`)
      .comment(`The color symbol code for this color.`)
      .notNullable()
      .unique()

    table.string(`icon`)
      .comment(`The icon associated with the color.`)
      .notNullable()
      .references(`id`)
      .inTable(`icon`)
      .onDelete(`NO ACTION`)
      .onUpdate(`NO ACTION`)

    table.string(`identity`)
      .comment(`The color identity associated with the color.`)
      .notNullable()
      .references(`id`)
      .inTable(`coloridentity`)
      .onDelete(`NO ACTION`)
      .onUpdate(`NO ACTION`)

    // Timestamps
    table.timestamps()
  }

  icon = () => this.hasOne(Icon, `id`, `icon`)

  identity = () => this.hasOne(ColorIdentity, `id`, `identity`)

  identities = () => this.belongsToMany(ColorIdentity, `id`).through(Colors, `id`, `colorIdentity`, `color`)
}
