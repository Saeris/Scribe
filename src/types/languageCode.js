import { GraphQLID, GraphQLNonNull, GraphQLList, GraphQLString, GraphQLObjectType } from 'graphql'
import Models from '../models'
import { Definition as Language } from './language'

export const Definition = new GraphQLObjectType({
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
      type: Language,
      description: `The language associated with the language code.`
    }
  })
})

export const Queries = {
  languageCode: {
    type: new GraphQLList(Definition),
    args: {
      id: {
        name: 'id',
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLID)))
      }
    },
    resolve(root, {id}) {
      return Models.LanguageCode
        .where('id', 'IN', id)
        .fetchAll()
        .then((collection) => {
          return collection.toJSON()
        })
    }
  },
  languageCodes: {
    type: new GraphQLList(Definition),
    resolve(root, {id}) {
      return Models.LanguageCode
        .findAll()
        .then((collection) => {
          return collection.toJSON()
        })
    }
  }
}

export const Mutations = {

}
