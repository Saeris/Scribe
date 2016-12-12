import { GraphQLID, GraphQLNonNull, GraphQLList, GraphQLString, GraphQLObjectType } from 'graphql'
import db from '../../config/bookshelf.config'
import Card from './card'
import ArtistCards from '../lists/artistCards'

export default class Artist extends db.Model {

  Definition = new GraphQLObjectType({
    name: `Artist`,
    description: `An Artist object`,
    fields: () => ({
      id: {
        type: GraphQLID,
        description: `A unique id for this artist.`
      },
      name: {
        type: GraphQLString,
        description: `The name of the artist.`
      },
      website: {
        type: GraphQLString,
        description: `A URL to the artist's website, if they have one.`
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
    artist: {
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
    artists: {
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
         .comment(`The name of the artist.`)
         .notNullable()

    table.text(`website`)
         .comment(`The website of the artist, if they have one.`)

    table.bigInteger(`cards`)
         .comment(`The cards associated with this artist.`)
         .notNullable()
         .unsigned()
         .index(`artist_cards`)

    // Timestamps
    table.timestamps()
  }

  static foreignKeys(table) {
    table.foreign(`cards`)
         .references(`artist`)
         .inTable(`artistcards`)
         .onDelete(`CASCADE`)
         .onUpdate(`NO ACTION`)
  }

  // Bookshelf Relation Definitions
  get tableName() { return `artist` }

  get hasTimestamps() { return true }

  card() {
    return this.belongsTo(Card, `artist`)
  }

  cards() {
    return this.hasMany(Card, `card`)
               .through(ArtistCards)
  }
}
