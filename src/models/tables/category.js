import db from '../../config/bookshelf.config'
import Card from './card'
import Categories from '../lists/categories'
import CategoryCards from '../lists/categoryCards'

export default class Category extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigIncrements(`id`)
         .notNullable()
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

  static foreignKeys(table) {
    table.foreign(`cards`)
         .references(`category`)
         .inTable(`categorycards`)
         .onDelete(`CASCADE`)
         .onUpdate(`NO ACTION`)
  }

  // Bookshelf Relation Definitions
  get tableName() { return `category` }

  get hasTimestamps() { return true }

  card() {
    return this.belongsTo(Card, `categories`)
               .through(Categories, `category`)
  }

  cards() {
    return this.hasMany(Card)
               .through(CategoryCards, `category`)
  }
}
