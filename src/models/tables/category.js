import db from '../../config/bookshelf.config'

import Card from './card'
import Categories from './categories'
import CategoryCards from './categoryCards'

export default class category extends db.Model {
  get tableName() {
   return 'category'
  }

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

  card() {
    return this.belongsTo(Card, 'categories')
               .through(Categories, 'category')
  }

  cards() {
    return this.hasMany(Card)
               .through(CategoryCards, 'category')
  }
}

export const Category = new category()
