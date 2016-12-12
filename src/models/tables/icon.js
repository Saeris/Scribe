import { GraphQLID, GraphQLNonNull, GraphQLList, GraphQLString, GraphQLObjectType } from 'graphql'
import db from '../../config/bookshelf.config'

export default class Icon extends db.Model {

  Definition = new GraphQLObjectType({
    name: 'Icon',
    description: 'An Icon object',
    fields: () => ({
      id: {
        type: GraphQLID,
        description: `A unique id for this icon.`
      },
      name: {
        type: GraphQLString,
        description: `The name of the icon.`
      },
      image: {
        type: GraphQLString,
        description: `A url to an image for this icon.`
      },
      class: {
        type: GraphQLString,
        description: `A CSS class used to display this icon.`
      }
    })
  })

  Queries = {
    icon: {
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
    icons: {
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
         .comment(`The name of the icon.`)
         .notNullable()

    table.text(`image`)
         .comment(`A URL pointing to an image of the icon.`)
         .notNullable()

    table.string(`class`)
         .comment(`CSS class name used to display the icon.`)
         .notNullable()

    // Timestamps
    table.timestamps()
  }

  static foreignKeys(table) {

  }

  // Bookshelf Relation Definitions
  get tableName() { return 'icon' }

  get hasTimestamps() { return true }
}
