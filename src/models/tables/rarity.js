import { GraphQLID, GraphQLNonNull, GraphQLList, GraphQLString, GraphQLObjectType } from 'graphql'
import db from '../../config/bookshelf.config'

export default class Rarity extends db.Model {

  Definition = new GraphQLObjectType({
    name: `Rarity`,
    description: `A Rarity object`,
    fields: () => ({
      id: {
        type: GraphQLID,
        description: `A unique id for this rarity.`
      },
      name: {
        type: GraphQLString,
        description: `The name of the rarity.`
      },
      class: {
        type: GraphQLString,
        description: `A CSS class used to display this rarity.`
      }
    })
  })

  Queries = {
    rarity: {
      type: new GraphQLList(this.Definition),
      args: {
        id: {
          name: `id`,
          type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLID)))
        }
      },
      resolve: (root, {id}) => {
        return this
          .where(`id`, `IN`, id)
          .fetchAll()
          .then((collection) => {
            return collection.toJSON()
          })
      }
    },
    rarities: {
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
         .comment(`The name of the rarity.`)
         .notNullable()

    table.string(`class`)
         .comment(`CSS class name used to display the rarity.`)
         .notNullable()

    // Timestamps
    table.timestamps()
  }

  static foreignKeys(table) {

  }

  // Bookshelf Relation Definitions
  get tableName() { return `rarity` }

  get hasTimestamps() { return true }
}
