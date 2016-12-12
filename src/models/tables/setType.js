import { GraphQLID, GraphQLNonNull, GraphQLList, GraphQLString, GraphQLObjectType } from 'graphql'
import db from '../../config/bookshelf.config'

export default class SetType extends db.Model {

  Definition = new GraphQLObjectType({
    name: `SetType`,
    description: `A Set Type object`,
    fields: () => ({
      id: {
        type: GraphQLID,
        description: `A unique id for this Set Type.`
      },
      name: {
        type: GraphQLString,
        description: `The Set Type name.`
      },
      description: {
        type: GraphQLString,
        description: `The description of the Set Type.`
      }
    })
  })

  Queries = {
    setType: {
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
    SetTypes: {
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
         .comment(`The name of the set type.`)
         .notNullable()

    table.text(`description`)
         .comment(`The description of the set type.`)

    // Timestamps
    table.timestamps()
  }

  static foreignKeys(table) {

  }

  // Bookshelf Relation Definitions
  get tableName() { return `setType` }

  get hasTimestamps() { return true }
}
