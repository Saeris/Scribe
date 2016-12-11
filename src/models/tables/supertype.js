import { GraphQLID, GraphQLNonNull, GraphQLList, GraphQLString, GraphQLObjectType } from 'graphql'
import { inject } from 'aurelia-dependency-injection'
import db from '../../config/bookshelf.config'

@inject()
export default class Supertype extends db.Model {
  constructor() {
    super()
  }

  Definition = new GraphQLObjectType({
    name: 'Supertype',
    description: 'A Supertype object',
    fields: () => ({
      id: {
        type: GraphQLID,
        description: `A unique id for this supertype.`
      },
      name: {
        type: GraphQLString,
        description: `The supertype name.`
      }
    })
  })

  Queries = {
    supertype: {
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
    supertypes: {
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
    createSupertype: {
      type: this.Definition,
      description: `Creates a new Supertype`,
      args: {
        name: {
          name: 'name',
          description: `The Name of the Supertype. (Required)`,
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
         .comment(`The name of the supertype.`)
         .notNullable()

    // Timestamps
    table.timestamps()
  }

  static foreignKeys(table) {

  }

  // Bookshelf Relation Definitions
  get tableName() { return 'supertype' }

  get hasTimestamps() { return true }
}
