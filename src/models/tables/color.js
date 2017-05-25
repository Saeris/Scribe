import db from '../../config/bookshelf.config'
import { Icon, ColorIdentity } from './'
import { Colors } from '../lists'

export default class Color extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigIncrements(`id`)
         .notNullable()
         .unsigned()
         .primary()
         .unique()

    table.string(`symbol`)
         .comment(`The color symbol code for this color.`)
         .notNullable()
         .notNullable()
         .unique()

    table.bigInteger(`icon`)
         .comment(`The icon associated with the color.`)
         .unsigned()
         .references(`id`)
         .inTable(`icon`)
         .onDelete(`NO ACTION`)
         .onUpdate(`NO ACTION`)

    table.bigInteger(`identity`)
         .comment(`The color identity associated with the color.`)
         .unsigned()
         .references(`id`)
         .inTable(`coloridentity`)
         .onDelete(`NO ACTION`)
         .onUpdate(`NO ACTION`)

    // Timestamps
    table.timestamps()
  }

  // Bookshelf Relation Definitions
  get tableName() { return `color` }

  get hasTimestamps() { return true }

  icon = () => this.hasOne(Icon, `id`, `icon`)

  identity = () => this.hasOne(ColorIdentity, `id`, `identity`)

  identities = () => this.belongsToMany(ColorIdentity, `id`).through(Colors, `id`, `coloridentity`, `color`)
}
