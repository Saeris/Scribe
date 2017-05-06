import db from '../../config/bookshelf.config'
import { Icon, ColorIdentity } from './'
import { Colors } from '../lists'

export default class Color extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigIncrements(`id`)
         .notNullable()
         .primary()

    table.string(`symbol`)
         .comment(`The color symbol code for this color.`)
         .notNullable()
         .notNullable()

    table.bigInteger(`icon`)
         .comment(`The icon associated with the color.`)
         .unsigned()
         .index(`color_icon`)

    table.bigInteger(`identity`)
         .comment(`The color identity associated with the color.`)
         .unsigned()
         .index(`color_identity`)

    // Timestamps
    table.timestamps()
  }

  static foreignKeys(table) {
    table.foreign(`icon`)
         .references(`id`)
         .inTable(`icon`)
         .onDelete(`NO ACTION`)
         .onUpdate(`NO ACTION`)

    table.foreign(`identity`)
         .references(`id`)
         .inTable(`coloridentity`)
         .onDelete(`NO ACTION`)
         .onUpdate(`NO ACTION`)
  }

  // Bookshelf Relation Definitions
  get tableName() { return `color` }

  get hasTimestamps() { return true }

  icon = () => this.hasOne(Icon, `id`, `icon`)

  identity = () => this.hasOne(ColorIdentity, `id`, `identity`)

  identities = () => this.belongsToMany(ColorIdentity, `id`).through(Colors, `id`, `coloridentity`, `color`)
}
