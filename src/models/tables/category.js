import db from '../../config/bookshelf.config'
import { bookshelfOptions } from '../../utilities'
import { Card } from './'
import { CategoryCards } from '../lists'

@bookshelfOptions
export default class Category extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.string(`id`)
      .notNullable()
      .primary()
      .unique()

    table.string(`name`)
      .comment(`The name of the category.`)
      .notNullable()
      .unique()

    table.text(`description`)
      .comment(`The description of the category.`)

    // Timestamps
    table.timestamps()
  }

  cards = () => this.hasMany(Card, `id`).through(CategoryCards, `id`, `category`, `card`)
}
