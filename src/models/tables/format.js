import { GraphQLID, GraphQLNonNull, GraphQLList, GraphQLString, GraphQLObjectType } from 'graphql'
import db from '../../config/bookshelf.config'
import Set from './set'

export default class Format extends db.Model {

  Definition = new GraphQLObjectType({
    name: 'Format',
    description: 'A Format object',
    fields: () => ({
      id: {
        type: GraphQLID,
        description: `A unique id for this format.`
      },
      name: {
        type: GraphQLString,
        description: `The format name.`
      },
      sets: {
        type: new GraphQLList((new Set()).Definition),
        description: `A list of sets included in this format`
      }
    })
  })

  Queries = {
    format: {
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
    formats: {
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
         .comment(`The name of the format.`)
         .notNullable()

    table.bigInteger(`sets`)
         .comment(`List of sets that are included in this format.`)
         .notNullable()
         .unsigned()
         .index(`format_sets`)

    // Timestamps
    table.timestamps()
  }

  static foreignKeys(table) {
    table.foreign(`sets`)
         .references(`format`)
         .inTable(`formatSets`)
         .onDelete(`CASCADE`)
         .onUpdate(`NO ACTION`)
  }

  // Bookshelf Relation Definitions
  get tableName() { return 'format' }

  get hasTimestamps() { return true }
}
