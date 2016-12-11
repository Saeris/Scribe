import { GraphQLID, GraphQLNonNull, GraphQLList, GraphQLString, GraphQLObjectType } from 'graphql'
import { inject } from 'aurelia-dependency-injection'
import db from '../../config/bookshelf.config'
import Format from './format'

@inject(Format)
export default class Legality extends db.Model {
  constructor(format) {
    super()
    this.Format = format
  }

  Definition = new GraphQLObjectType({
    name: 'Legality',
    description: 'A Legality object',
    fields: () => ({
      id: {
        type: GraphQLID,
        description: `A unique id for this name.`
      },
      cardID: {
        type: GraphQLID,
        description: `The ID of the card.`
      },
      format: {
        type: this.Format.Definition,
        description: `The format the card is legal in.`
      },
      legal: {
        type: GraphQLBoolean,
        description: `Set to True if the card is Legal to play in the given format.`
      },
      restricted: {
        type: GraphQLBoolean,
        description: `Set to True if the card is restricted in the given format.`
      }
    })
  })

  Queries = {
    legality: {
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
    legalities: {
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
    // Indexes
    table.bigIncrements(`id`)
         .notNullable()
         .primary()

    // Fields
    table.bigInteger(`format`)
         .comment(`The format associated with this legality.`)
         .notNullable()
         .unsigned()
         .index(`format`)

    table.boolean(`legal`)
         .comment(`True if the card is legal in the associated format.`)
         .notNullable()

    table.boolean(`restricted`)
         .comment(`True if the card is restricted in the associated format.`)
         .notNullable()

    table.bigInteger(`cards`)
         .comment(`List of cards that have this legality ruling.`)
         .notNullable()
         .unsigned()
         .index(`cards`)

    // Timestamps
    table.timestamps()
  }

  static foreignKeys(table) {
    table.foreign(`format`)
         .references(`id`)
         .inTable(`format`)
         .onDelete(`NO ACTION`)
         .onUpdate(`NO ACTION`)

    table.foreign(`cards`)
         .references(`legality`)
         .inTable(`legalitycards`)
         .onDelete(`CASCADE`)
         .onUpdate(`NO ACTION`)
  }

  // Bookshelf Relation Definitions
  get tableName() { return 'legality' }

  get hasTimestamps() { return true }
}
