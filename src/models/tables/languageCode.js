import { GraphQLID, GraphQLNonNull, GraphQLList, GraphQLString, GraphQLObjectType } from 'graphql'
import db from '../../config/bookshelf.config'
import Language from './language'

export default class LanguageCode extends db.Model {

  Definition = new GraphQLObjectType({
    name: 'LanguageCode',
    description: 'A language code object',
    fields: () => ({
      id: {
        type: GraphQLID,
        description: `A unique id for this language.`
      },
      code: {
        type: GraphQLString,
        description: `The language code.`
      },
      language: {
        type: (new Language()).Definition,
        description: `The language associated with the language code.`
      }
    })
  })

  Queries = {
    languageCode: {
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
    languageCodes: {
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

    table.string(`code`)
         .comment(`The language code.`)
         .notNullable()

    table.bigInteger(`language`)
         .comment(`The language associated with the language code.`)
         .notNullable()
         .unsigned()
         .index(`languagecode_language`)

    // Timestamps
    table.timestamps()
  }

  static foreignKeys(table) {
    table.foreign(`language`)
         .references(`id`)
         .inTable(`language`)
         .onDelete(`NO ACTION`)
         .onUpdate(`NO ACTION`)
  }

  // Bookshelf Relation Definitions
  get tableName() { return 'languagecode' }

  get hasTimestamps() { return true }
}
