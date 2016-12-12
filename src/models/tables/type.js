import { GraphQLID, GraphQLNonNull, GraphQLList, GraphQLString, GraphQLObjectType } from 'graphql'
import db from '../../config/bookshelf.config'

export default class Type extends db.Model {

  Definition = new GraphQLObjectType({
    name: 'Type',
    description: 'A Type object',
    fields: () => ({
      id: {
        type: GraphQLID,
        description: `A unique id for this type.`
      },
      name: {
        type: GraphQLString,
        description: `The type name.`
      }
    })
  })

  Queries = {
    type: {
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
    types: {
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
    createType: {
      type: this.Definition,
      description: `Creates a new Type`,
      args: {
        name: {
          name: 'name',
          description: `The Name of the Type. (Required)`,
          type: new GraphQLNonNull(GraphQLString)
        }
      },
      resolve(root, {name}) {
        return this
          .upsert({name: name}, {name: name})
          .then((model) => {
            return model.toJSON()
          })
      }
    }
  }

  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigIncrements(`id`)
         .notNullable()
         .primary()

    table.string(`name`)
         .comment(`The name of the type.`)
         .notNullable()

    // Timestamps
    table.timestamps()
  }

  static foreignKeys(table) {

  }

  // Bookshelf Relation Definitions
  get tableName() { return 'type' }

  get hasTimestamps() { return true }
}
