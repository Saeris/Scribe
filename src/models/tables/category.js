import db from '../../config/bookshelf.config'
import { Card } from './'
import { CategoryCards } from '../lists'

export default class Category extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigIncrements(`id`)
         .notNullable()
         .unsigned()
         .primary()

    table.string(`name`)
         .comment(`The name of the category.`)
         .notNullable()

    table.text(`description`)
         .comment(`The description of the category.`)

    table.bigInteger(`cards`)
         .comment(`A list of cards that have this category.`)
         .notNullable()
         .unsigned()
         .index(`category_cards`)

    // Timestamps
    table.timestamps()
  }

  // Bookshelf Relation Definitions
  get tableName() { return `category` }

  get hasTimestamps() { return true }

  cards = () => this.hasMany(Card).through(CategoryCards, `category`)
}
