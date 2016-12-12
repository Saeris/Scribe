import { GraphQLID, GraphQLNonNull, GraphQLList, GraphQLString, GraphQLObjectType } from 'graphql'
import db from '../../config/bookshelf.config'
import Card from './card'
import Language from './language'

export default class Name extends db.Model {

  Definition = new GraphQLObjectType({
    name: 'Name',
    description: 'A Name object',
    fields: () => ({
      id: {
        type: GraphQLID,
        description: `A unique id for this name.`
      },
      name: {
        type: GraphQLString,
        description: `The localized name of a card.`
      },
      language: {
        type: (new Language()).Definition,
        description: `The language name.`
      },
      cards: {
        type: new GraphQLList((new Card()).Definition),
        description: `A list of cards featuring art from this artist.`,
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
    name: {
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
    names: {
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
         .comment(`The localized name of the card.`)
         .notNullable()

    table.bigInteger(`language`)
         .comment(`The language code of the language the name is localized in.`)
         .notNullable()
         .unsigned()
         .index(`language`)

    table.bigInteger(`cards`)
         .comment(`A list of cards that have this name.`)
         .notNullable()
         .unsigned()
         .index(`cards`)

    // Timestamps
    table.timestamps()
  }

  static foreignKeys(table) {
    table.foreign(`language`)
         .references(`id`)
         .inTable(`languagecode`)
         .onDelete(`NO ACTION`)
         .onUpdate(`NO ACTION`)

    table.foreign(`cards`)
         .references(`name`)
         .inTable(`namecards`)
         .onDelete(`CASCADE`)
         .onUpdate(`NO ACTION`)
  }

  // Bookshelf Relation Definitions
  get tableName() { return 'name' }

  get hasTimestamps() { return true }

  cards() {
    return this.belongsTo(Card, "card")
  }
}
