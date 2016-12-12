import { GraphQLID, GraphQLNonNull, GraphQLList, GraphQLString, GraphQLObjectType } from 'graphql'
import db from '../../config/bookshelf.config'
import Set from './set'
import BlockSets from '../lists/blockSets'

export default class Block extends db.Model {

  Definition = new GraphQLObjectType({
    name: 'Block',
    description: 'A Block object',
    fields: () => ({
      id: {
        type: GraphQLID,
        description: `A unique id for this block.`
      },
      name: {
        type: GraphQLString,
        description: `The name of the block.`
      },
      sets: {
        type: new GraphQLList((new Set()).Definition),
        description: `List of sets that are included in this block.`,
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
    block: {
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
    blocks: {
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
         .comment(`The name of the block.`)
         .notNullable()

    table.bigInteger(`sets`)
         .comment(`List of sets that are included in this block.`)
         .notNullable()
         .unsigned()
         .index(`block_sets`)

    // Timestamps
    table.timestamps()
  }

  static foreignKeys(table) {
    table.foreign(`sets`)
         .references(`block`)
         .inTable(`blockSets`)
         .onDelete(`CASCADE`)
         .onUpdate(`NO ACTION`)
  }

  // Bookshelf Relation Definitions
  get tableName() { return 'block' }

  get hasTimestamps() { return true }

  set() {
    return this.belongsTo(Set, 'block')
  }

  sets() {
    return this.hasMany(Set)
               .through(BlockSets)
  }
}
