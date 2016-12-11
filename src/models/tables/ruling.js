import { GraphQLID, GraphQLNonNull, GraphQLList, GraphQLString, GraphQLObjectType } from 'graphql'
import { inject } from 'aurelia-dependency-injection'
import db from '../../config/bookshelf.config'
import Card from './card'
import LanguageCode from './languageCode'

@inject(Card, LanguageCode)
export default class Ruling extends db.Model {
  constructor(card, languageCode) {
    super()
    this.Card = card
    this.LanguageCode = languageCode
  }

  Definition = new GraphQLObjectType({
    name: 'Ruling',
    description: 'An Ruling object',
    fields: () => ({
      id: {
        type: GraphQLID,
        description: `A unique id for this ruling.`
      },
      text: {
        type: GraphQLString,
        description: `The text of the ruling.`
      },
      date: {
        type: GraphQLString,
        description: `The date this ruling was issued.`
      },
      language: {
        type: this.LanguageCode.Definition,
        description: `The language code of this ruling.`
      },
      cards: {
        type: new GraphQLList(this.Card.Definition),
        description: `List of cards that have this ruling.`,
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
    ruling: {
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
    rulings: {
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
    table.text(`text`)
         .comment(`The localized text of the ruling.`)
         .notNullable()

    table.date(`date`)
         .comment(`The date the ruling was issued.`)
         .notNullable()

    table.bigInteger(`language`)
         .comment(`The language code of this ruling.`)
         .notNullable()
         .unsigned()
         .index(`language`)

    table.bigInteger(`cards`)
         .comment(`List of cards that have this ruling.`)
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
         .references(`ruling`)
         .inTable(`rulingcards`)
         .onDelete(`CASCADE`)
         .onUpdate(`NO ACTION`)
  }

  // Bookshelf Relation Definitions
  get tableName() { return 'ruling' }

  get hasTimestamps() { return true }
}
