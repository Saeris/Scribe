import { GraphQLID, GraphQLNonNull, GraphQLList, GraphQLString, GraphQLObjectType } from 'graphql'
import db from '../../config/bookshelf.config'

export default class Booster extends db.Model {

  Definition = new GraphQLObjectType({
    name: 'Booster',
    description: 'A Booster object',
    fields: () => ({
      id: {
        type: GraphQLID,
        description: `A unique id for this booster.`
      }
    })
  })

  Queries = {

  }

  Mutations = {

  }

  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigIncrements(`id`)
         .notNullable()
         .primary()

    // Timestamps
    table.timestamps()
  }

  static foreignKeys(table) {

  }

  // Bookshelf Relation Definitions
  get tableName() { return 'booster' }

  get hasTimestamps() { return true }
}
