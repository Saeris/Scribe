import db from '../../config/bookshelf.config'
import { bookshelfOptions } from '../../utilities'
import { Icon } from './'

@bookshelfOptions
export default class Layout extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.string(`id`)
      .notNullable()
      .primary()
      .unique()

    table.string(`name`)
      .comment(`The name of the layout.`)
      .notNullable()
      .unique()

    table.string(`watermark`)
      .comment(`Watermark icon used in this layout.`)

    table.string(`icons`)
      .comment(`List of icons used in this layout.`)

    // Timestamps
    table.timestamps()
  }

  icons = () => this.hasMany(Icon, `icons`)
}
