import { GraphQLID, GraphQLNonNull, GraphQLList, GraphQLString, GraphQLObjectType } from 'graphql'
import { inject } from 'aurelia-dependency-injection'
import db from '../../config/bookshelf.config'
import ColorIdentity from './colorIdentity'

@inject(ColorIdentity)
export default class Color extends db.Model {
  constructor(colorIdentity) {
    super()
    this.ColorIdentity = colorIdentity
  }

  Definition = new GraphQLObjectType({
    name: 'Color',
    description: 'A Color object',
    fields: () => ({
      id: {
        type: GraphQLID,
        description: `A unique id for this color.`
      },
      symbol: {
        type: GraphQLString,
        description: `The color symbol code for this color.`
      },
      class: {
        type: GraphQLString,
        description: `A CSS class used to display a mana symbol for this color.`
      },
      indentity: {
        type: this.ColorIdentity,
        description: `The color identity of this color.`
      }
    })
  })

  Queries = {
    color: {
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
    colors: {
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

    table.string(`symbol`)
         .comment(`The color symbol code for this color.`)
         .notNullable()

    table.bigInteger(`icon`)
         .comment(`The icon associated with the color.`)
         .notNullable()
         .unsigned()
         .index(`color_icon`)

    table.bigInteger(`identity`)
         .comment(`The color identity associated with the color.`)
         .notNullable()
         .unsigned()
         .index(`color_identity`)

    // Timestamps
    table.timestamps()
  }

  static foreignKeys(table) {
    table.foreign(`icon`)
         .references(`id`)
         .inTable(`icon`)
         .onDelete(`NO ACTION`)
         .onUpdate(`NO ACTION`)

    table.foreign(`identity`)
         .references(`id`)
         .inTable(`coloridentity`)
         .onDelete(`NO ACTION`)
         .onUpdate(`NO ACTION`)
  }

  // Bookshelf Relation Definitions
  get tableName() { return 'color' }

  get hasTimestamps() { return true }
}
