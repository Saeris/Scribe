import { GraphQLID, GraphQLNonNull, GraphQLList, GraphQLString, GraphQLObjectType } from 'graphql'
import { inject } from 'aurelia-dependency-injection'
import db from '../../config/bookshelf.config'
import Card from './card'
import Categories from '../lists/categories'
import CategoryCards from '../lists/categoryCards'

@inject(Card)
export default class Category extends db.Model {
  constructor(card) {
    super()
    this.Card = card
  }

  Definition = new GraphQLObjectType({
    name: 'Category',
    description: 'A Category object',
    fields: () => ({
      id: {
        type: GraphQLID,
        description: `A unique id for this category.`
      },
      name: {
        type: GraphQLString,
        description: `The category name.`
      },
      description: {
        type: GraphQLString,
        description: `The description of the category.`
      },
      cards: {
        type: new GraphQLList(this.Card.Definition),
        description: `A list of cards that have this category.`,
        resolve: (root, {artist}) => {
          return this
            .forge({artist: artist.id})
            .fetch({withRelated: ['cards']})
            .then(artist => artist.toJSON().cards)
        }
      }
    })
  })

  Queries = {
    category: {
      type: new GraphQLList(this.Definition),
      args: {
        id: {
          name: 'id',
          type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLID)))
        }
      },
      resolve: (root, {id}) => {
        return this
          .where('id', 'IN', id)
          .fetchAll()
          .then((collection) => {
            return collection.toJSON()
          })
      }
    },
    categories: {
      type: new GraphQLList(this.Definition),
      resolve: (root, {id}) => {
        return this
          .findAll()
          .then((collection) => {
            return collection.toJSON()
          })
      }
    }
  }

  Mutations = {

  }

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
  get tableName() { return 'category' }

  get hasTimestamps() { return true }

  card() {
    return this.belongsTo(Card, 'categories')
               .through(Categories, 'category')
  }

  cards() {
    return this.hasMany(Card)
               .through(CategoryCards, 'category')
  }
}
