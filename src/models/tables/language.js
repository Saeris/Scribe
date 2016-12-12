import { GraphQLID, GraphQLNonNull, GraphQLList, GraphQLString, GraphQLObjectType } from 'graphql'
import db from '../../config/bookshelf.config'
import LanguageCode from './languageCode'

export default class Language extends db.Model {

  Definition = new GraphQLObjectType({
    name: `Language`,
    description: `A language object`,
    fields: () => ({
      id: {
        type: GraphQLID,
        description: `A unique id for this language.`
      },
      name: {
        type: GraphQLString,
        description: `The name of the language.`
      },
      code: {
        type: (new LanguageCode()).Definition,
        description: `The language code associated with this language.`
      }
    })
  })

  Queries = {
    language: {
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
    languages: {
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
         .comment(`The name of the language.`)
         .notNullable()

    table.bigInteger(`code`)
         .comment(`The language code associated with this language.`)
         .notNullable()
         .unsigned()
         .index(`language_code`)

    // Timestamps
    table.timestamps()
  }

  static foreignKeys(table) {
    table.foreign(`code`)
         .references(`id`)
         .inTable(`languagecode`)
         .onDelete(`NO ACTION`)
         .onUpdate(`NO ACTION`)
  }

  // Bookshelf Relation Definitions
  get tableName() { return `language` }

  get hasTimestamps() { return true }
}
