import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLEnumType, GraphQLList, GraphQLString, GraphQLObjectType, GraphQLInputObjectType } from 'graphql'
import { destroy, hashPassword, issueToken, load, loadRelated, order, read, update, validatePassword, verifyToken } from './utilities'
import Models from '../models'
import { Collection, Gender, Profile } from './'

export const Input = new GraphQLInputObjectType({
  name: `UserInput`,
  description: `Required fields for a new User object`,
  fields: () => ({
    firstName:  { type: new GraphQLNonNull(GraphQLString) },
    lastName:   { type: new GraphQLNonNull(GraphQLString) },
    gender:     { type: new GraphQLNonNull(GraphQLID) },
    username:   { type: new GraphQLNonNull(GraphQLString) },
    password:   { type: new GraphQLNonNull(GraphQLString) },
    email:      { type: new GraphQLNonNull(GraphQLString) },
    location:   { type: GraphQLString }
  })
})

const Filter = new GraphQLInputObjectType({
  name: `UserFilter`,
  description: `Queryable fields for User.`,
  fields: () => ({
    firstName: { type: new GraphQLList(GraphQLString) },
    lastName:   { type: new GraphQLList(GraphQLString) },
    gender:     { type: new GraphQLList(GraphQLID) },
    username:   { type: new GraphQLList(GraphQLString) },
    email:      { type: new GraphQLList(GraphQLString) },
    profiles:   { type: new GraphQLList(GraphQLID) },
    location:   { type: new GraphQLList(GraphQLString) },
    collection: { type: new GraphQLList(GraphQLID) }
  })
})

const Fields = new GraphQLEnumType({
  name: `UserFields`,
  description: `Field names for User.`,
  values: {
    firstName: { value: `firstName` },
    lastName:  { value: `lastName` },
    gender:    { value: `gender` },
    username:  { value: `username` },
    email:     { value: `email` },
    location:  { value: `location` }
  }
})

export const Definition = new GraphQLObjectType({
  name: `User`,
  description: `A User object`,
  fields: () => ({
    id: {
      type: GraphQLID,
      description: `A unique id for this set.`
    },
    firstName: {
      type: GraphQLString,
      description: `A user's first name.`
    },
    lastName: {
      type: GraphQLString,
      description: `A user's last name.`
    },
    gender: {
      type: Gender.Definition,
      description: `A user's gender identity.`,
      resolve: type => load(type.gender, Models.Gender)
    },
    username: {
      type: GraphQLString,
      description: `A user's username.`
    },
    password: {
      type: GraphQLString,
      description: `A user's password.`
    },
    email: {
      type: GraphQLString,
      description: `A user's email address.`
    },
    profiles: {
      type: Profile.Definition,
      description: `A user's gender identity.`,
      resolve: type => loadRelated(type.id, Models.Profile, `profiles`)
    },
    location: {
      type: GraphQLString,
      description: `A user's location.`
    },
    collection: {
      type: Collection.Definition,
      description: `A user's card collection.`,
      resolve: type => load(type.collection, Models.Collection)
    },
    token: {
      type: GraphQLString,
      description: `JSON Web Token for this User`
    }
  })
})

export const Queries = {
  user: {
    type: new GraphQLList(Definition),
    description: `Returns a User.`,
    args: {
      id: { type: new GraphQLList(GraphQLID) },
      filter: {
        type: Filter
      },
      limit: { type: GraphQLInt },
      offset: { type: GraphQLInt },
      orderBy: { type: order(`user`, Fields) }
    },
    resolve: (parent, args, context) => read(parent, args, context, Definition.name)
  }
}

export const Mutations = {
  updateUser: {
    type: Definition,
    description: `Updates an existing User, creates it if it does not already exist`,
    args: { input: { type: Input } },
    resolve: (parent, { input }, context) => update(parent, args, context, Definition.name)
  },
  deleteUser: {
    type: Definition,
    description: `Deletes a User by id`,
    args: { id: { type: GraphQLID } },
    resolve: (parent, args, context) => destroy(parent, args, context, Definition.name)
  },
  login: {
    type: new GraphQLObjectType({
      name: `login`,
      fields: {
        username: { type: GraphQLString },
        message:  { type: GraphQLString }
      }
    }),
    args: {
      email: { name: `email`, type: new GraphQLNonNull(GraphQLString) },
      password: { name: `password`, type: new GraphQLNonNull(GraphQLString) }
    },
    resolve: (parent, { email, password }, context) => {
      // find user by email
      return Models.User.findOne({ where: { email } }).then(user => {
        if (user) {
          return validatePassword(password, user.password).then(res => {
            if (res) {
              const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET)
              user.jwt = token
              context.user = Promise.resolve(user)
              return user
            }
            return Promise.reject(`Incorrect Password`)
          })
        }
        return Promise.reject(`Email Address Not Found`)
      })
    }
  },
  register: {
    type: new GraphQLObjectType({
      name: `register`,
      fields: {
        username: { type: GraphQLString },
        password: { type: GraphQLString },
        message:  { type: GraphQLString }
      }
    }),
    args: {
      email: { name: `email`, type: new GraphQLNonNull(GraphQLString) },
      password: { name: `password`, type: new GraphQLNonNull(GraphQLString) },
      username: { name: `username`, type: new GraphQLNonNull(GraphQLString) }
    },
    resolve: (parent, { email, password, username }, context) => {
      return Models.User.findOne({ where: { email } }).then(exists => {
        if (!exists) {
          return hashPassword(password, 10).then(hash=> Models.User.create({
            email,
            password: hash,
            username: username
          })).then(user => {
            const { id } = user
            const token = jwt.sign({ id, email }, JWT_SECRET)
            user.jwt = token
            ctx.user = Promise.resolve(user)
            return user
          })
        }

        return Promise.reject(`A User With That Email Already Exists`)
      })
    }
  }
}
