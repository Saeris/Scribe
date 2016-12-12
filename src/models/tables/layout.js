import { GraphQLID, GraphQLNonNull, GraphQLList, GraphQLString, GraphQLObjectType } from 'graphql'
import db from '../../config/bookshelf.config'
import Icon from './icon'

export default class Layout extends db.Model {

  Definition = new GraphQLObjectType({
    name: `Layout`,
    description: `A Layout object`,
    fields: () => ({
      id: {
        type: GraphQLID,
        description: `A unique id for this layout.`
      },
      name: {
        type: GraphQLString,
        description: `The name of the layout type.`
      },
      watermark: {
        type: GraphQLString,
        description: `Watermark that appears in this layout.`
      },
      icons: {
        type: new GraphQLList((new Icon()).Definition),
        description: `A list of icons featured on this card.`
      }
    })
  })

  Queries = {
    layout: {
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
    layouts: {
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
         .comment(`The name of the layout.`)
         .notNullable()

    table.bigInteger(`watermark`)
         .comment(`Watermark icon used in this layout.`)
         .unsigned()
         .index(`watermark`)

    table.bigInteger(`icons`)
         .comment(`List of icons used in this layout.`)
         .notNullable()
         .unsigned()
         .index(`icons`)

    // Timestamps
    table.timestamps()
  }

  static foreignKeys(table) {
    table.foreign(`icons`)
         .references(`layout`)
         .inTable(`icons`)
         .onDelete(`CASCADE`)
         .onUpdate(`NO ACTION`)
  }

  // Bookshelf Relation Definitions
  get tableName() { return `layout` }

  get hasTimestamps() { return true }
}
