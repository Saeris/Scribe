import db from '../../config/bookshelf.config'
import { Icon } from './'

export default class Layout extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigIncrements(`id`)
         .notNullable()
         .unsigned()
         .primary()

    table.string(`name`)
         .comment(`The name of the layout.`)
         .notNullable()

    table.bigInteger(`watermark`)
         .comment(`Watermark icon used in this layout.`)
         .unsigned()
         .index(`layout_watermark`)

    table.bigInteger(`icons`)
         .comment(`List of icons used in this layout.`)
         .unsigned()
         .index(`layout_icons`)

    // Timestamps
    table.timestamps()
  }

  // Bookshelf Relation Definitions
  get tableName() { return `layout` }

  get hasTimestamps() { return true }

  icons = () => this.hasMany(Icon, `icons`)
}
