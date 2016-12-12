import { GraphQLID, GraphQLNonNull, GraphQLList, GraphQLString, GraphQLObjectType } from 'graphql'
import db from '../../config/bookshelf.config'

export default class Subtype extends db.Model {

  Definition = new GraphQLObjectType({
    name: 'Subtype',
    description: 'A Subtype object',
    fields: () => ({
      id: {
        type: GraphQLID,
        description: `A unique id for this subtype.`
      },
      name: {
        type: GraphQLString,
        description: `The subtype name.`
      }
    })
  })

  Queries = {
    subtype: {
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
    subtypes: {
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
    createSubtype: {
      type: this.Definition,
      description: `Creates a new Subtype`,
      args: {
        name: {
          name: 'name',
          description: `The Name of the Subtype. (Required)`,
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
         .comment(`The name of the subtype.`)
         .notNullable()

    // Timestamps
    table.timestamps()
  }

  static foreignKeys(table) {

  }

  // Bookshelf Relation Definitions
  get tableName() { return 'subtype' }

  get hasTimestamps() { return true }
}
