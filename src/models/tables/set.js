import { GraphQLID, GraphQLNonNull, GraphQLList, GraphQLString, GraphQLObjectType } from 'graphql'
import db from '../../config/bookshelf.config'
import Icon from './icon'
import Block from './block'
import Booster from './booster'
import SetType from './setType'

export default class Set extends db.Model {

  Definition = new GraphQLObjectType({
    name: 'Set',
    description: 'A Set object',
    fields: () => ({
      id: {
        type: GraphQLID,
        description: `A unique id for this set.`
      },
      name: {
        type: GraphQLString,
        description: `The set name.`
      },
      code: {
        type: GraphQLString,
        description: `The set code for this set.`
      },
      block: {
        type: (new Block()).Definition,
        description: `The block the set belongs to.`
      },
      type: {
        type: (new SetType()).Definition,
        description: `The set type.`
      },
      icon: {
        type: (new Icon()).Definition,
        description: `The icon associated with the set.`
      },
      border: {
        type: GraphQLString,
        description: `The card border color for this set.`
      },
      releaseDate: {
        type: GraphQLString,
        description: `The date this card was released. This is only set for promo cards. The date may not be accurate to an exact day and month, thus only a partial date may be set (YYYY-MM-DD or YYYY-MM or YYYY). Some promo cards do not have a known release date.`
      },
      booster: {
        type: (new Booster()).Definition,
        description: `A booster pack for this set`
      }
    })
  })

  Queries = {
    set: {
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
    sets: {
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
         .comment(`The name of the set.`)
         .notNullable()

    table.string(`code`)
         .comment(`The set code.`)
         .notNullable()

    table.bigInteger(`block`)
         .comment(`The block the set belongs to.`)
         .notNullable()
         .unsigned()
         .index(`block`)

    table.bigInteger(`type`)
         .comment(`The type of the set.`)
         .notNullable()
         .unsigned()
         .index(`type`)

    table.bigInteger(`icon`)
         .comment(`The icon associated with the set.`)
         .notNullable()
         .unsigned()
         .index(`icon`)

    table.string(`border`)
         .comment(`The border color of the set.`)
         .notNullable()

    table.date(`releasedate`)
         .comment(`The date on which the set was released.`)
         .notNullable()

    // Timestamps
    table.timestamps()
  }

  static foreignKeys(table) {
    table.foreign(`block`)
         .references(`id`)
         .inTable(`block`)
         .onDelete(`NO ACTION`)
         .onUpdate(`NO ACTION`)

    table.foreign(`type`)
         .references(`id`)
         .inTable(`settype`)
         .onDelete(`NO ACTION`)
         .onUpdate(`NO ACTION`)

    table.foreign(`icon`)
         .references(`id`)
         .inTable(`icon`)
         .onDelete(`NO ACTION`)
         .onUpdate(`NO ACTION`)
  }

  // Bookshelf Relation Definitions
  get tableName() { return 'set' }

  get hasTimestamps() { return true }
}
