import { GraphQLID, GraphQLNonNull, GraphQLList, GraphQLString, GraphQLObjectType } from 'graphql'
import db from '../../config/bookshelf.config'
import Color from './color'

export default class ColorIdentity extends db.Model {

  Definition = new GraphQLObjectType({
    name: `ColorIdentity`,
    description: `A Color Identity object`,
    fields: () => ({
      id: {
        type: GraphQLID,
        description: `A unique id for this color identity.`
      },
      name: {
        type: GraphQLString,
        description: `The color identity name.`
      },
      alias: {
        type: GraphQLString,
        description: `The alias of the color identity. Examples: Bant, Jeskai`
      },
      colors: {
        type: new GraphQLList((new Color()).Definition),
        description: `A list of colors included in this color identity.`
      },
      multicolored: {
        type: GraphQLBoolean,
        description: `Set to True if the color identity counts as multicolored.`
      },
      devoid: {
        type: GraphQLBoolean,
        description: `Set to True if the color identity counts as devoid.`
      }
    })
  })

  Queries = {
    colorIdentity: {
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
    colorIdentities: {
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
         .comment(`The name of the color identity.`)
         .notNullable()

    table.string(`alias`)
         .comment(`The alias of the color identity. Examples: Bant, Jeskai`)

    table.bigInteger(`colors`)
         .comment(`List of colors included in this color identity.`)
         .notNullable()
         .unsigned()
         .index(`colorIdentity_colors`)

    table.boolean(`multicolored`)
         .comment(`True if the color identity has more than one color.`)
         .notNullable()

    table.boolean(`devoid`)
         .comment(`True if the color identity is ruled to be colorless.`)
         .notNullable()

    // Timestamps
    table.timestamps()
  }

  static foreignKeys(table) {
    table.foreign(`colors`)
         .references(`coloridentity`)
         .inTable(`colors`)
         .onDelete(`CASCADE`)
         .onUpdate(`NO ACTION`)
  }

  // Bookshelf Relation Definitions
  get tableName() { return `colorIdentity` }

  get hasTimestamps() { return true }
}
