import { GraphQLID, GraphQLNonNull, GraphQLList, GraphQLString, GraphQLObjectType } from 'graphql'
import Models from '../models'
import { Definition as LanguageCode } from './languageCode'

export const Definition = new GraphQLObjectType({
  name: 'Language',
  description: 'A language object',
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
      type: LanguageCode,
      description: `The language code associated with this language.`
    }
  })
})

export const Queries = {
  language: {
    type: new GraphQLList(Definition),
    args: {
      id: {
        name: 'id',
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLID)))
      }
    },
    resolve(root, {id}) {
      return Models.Language
        .where('id', 'IN', id)
        .fetchAll()
        .then((collection) => {
          return collection.toJSON()
        })
    }
  },
  languages: {
    type: new GraphQLList(Definition),
    resolve(root, {id}) {
      return Models.Language
        .findAll()
        .then((collection) => {
          return collection.toJSON()
        })
    }
  }
}

export const Mutations = {

}
