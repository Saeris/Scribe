import { GraphQLID, GraphQLNonNull, GraphQLList, GraphQLString, GraphQLObjectType } from 'graphql'
import db from '../../config/bookshelf.config'
import Card from './card'
import LanguageCode from './languageCode'

export default class Keyword extends db.Model {

  Definition = new GraphQLObjectType({
    name: `Keyword`,
    description: `A Keyword object`,
    fields: () => ({
      id: {
        type: GraphQLID,
        description: `A unique id for this keyword.`
      },
      name: {
        type: GraphQLString,
        description: `The name of the keyword.`
      },
      reminderText: {
        type: GraphQLString,
        description: `A short description of the keyword ability's rules.`
      },
      languageCode: {
        type: (new LanguageCode()).Definition,
        description: `The language code the reminder text of keyword is localized in.`
      },
      cards: {
        type: new GraphQLList((new Card()).Definition),
        description: `A list of cards featuring art from this artist.`,
        resolve: (root, {artist}) => {
          return this
            .forge({artist: artist.id})
            .fetch({withRelated: [`cards`]})
            .then(model => model.toJSON().cards)
        }
      }
    })
  })

  Queries = {
    keyword: {
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
    keywords: {
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
         .comment(`The name of the keyword.`)
         .notNullable()

    table.text(`reminderText`)
         .comment(`A short description of the keyword ability's rules.`)

    table.bigInteger(`languageCode`)
         .comment(`The language code the reminder text of keyword is localized in.`)
         .notNullable()
         .unsigned()
         .index(`keyword_code`)

    table.bigInteger(`cards`)
         .comment(`A list of cards that have this keyword.`)
         .notNullable()
         .unsigned()
         .index(`keyword_cards`)

    // Timestamps
    table.timestamps()
  }

  static foreignKeys(table) {
    table.foreign(`cards`)
         .references(`keyword`)
         .inTable(`keywordcards`)
         .onDelete(`CASCADE`)
         .onUpdate(`NO ACTION`)
  }

  // Bookshelf Relation Definitions
  get tableName() { return `keyword` }

  get hasTimestamps() { return true }
}
