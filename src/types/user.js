import {
  nodeInterface,
  DateRange,
  createFilter,
  createInput,
  createOrder,
  //create,
  read,
  update,
  destroy,
  sqlJoin,
  junction,
  orderBy,
  where
} from "@/utilities"
import { Collection, CollectionFilter, CollectionOrder } from "./collection"
import { Gender, GenderFilter, GenderOrder } from "./gender"
import { Profile, ProfileFilter, ProfileOrder } from "./profile"

export const Definition = new GqlObject({
  name: `User`,
  description: `A User object`,
  interfaces: [nodeInterface],
  sqlTable: `user`,
  uniqueKey: `id`,
  timestamps: table => table.timestamps(),
  fields: disabled => ({
    globalId: {
      ...globalId(),
      description: `The global ID for the Relay spec`,
      sqlDeps: [`id`]
    },
    id: {
      type: new GqlNonNull(GqlID),
      description: `The User ID.`,
      sqlColumn: `id`,
      column: table => table.string(`id`).notNullable().primary().unique()
    },
    created: {
      type: new GqlNonNull(GqlDateTime),
      sqlColumn: `created`,
      sortable: true,
      filter: { type: DateRange }
    },
    updated: {
      type: new GqlNonNull(GqlDateTime),
      sqlColumn: `updated`,
      sortable: true,
      filter: { type: DateRange }
    },
    fullName: {
      type: new GqlNonNull(GqlString),
      description: `The User's full name. (User Account Type Only)`,
      sqlDeps: [`firstName`, `lastName`],
      resolve: user => `${user.firstName} ${user.lastName}`
    },
    firstName: {
      type: new GqlNonNull(GqlString),
      description: `A user's first name.`,
      sqlColumn: `firstName`,
      column: table => table.string(`firstName`).notNullable(),
      input: true,
      sortable: true,
      filter: { type: new GqlList(GqlString) }
    },
    lastName: {
      type: new GqlNonNull(GqlString),
      description: `A user's last name.`,
      sqlColumn: `lastName`,
      column: table => table.string(`lastName`).notNullable(),
      input: true,
      sortable: true,
      filter: { type: new GqlList(GqlString) }
    },
    gender: {
      type: Gender,
      description: `A user's gender identity.`,
      column: table => table.string(`gender`).notNullable(),
      input: { type: new GqlNonNull(GqlID) },
      args: { ...GenderFilter, ...GenderOrder },
      where,
      orderBy,
      sqlJoin: sqlJoin(`gender`)
    },
    username: {
      type: new GqlNonNull(GqlString),
      description: `A user's username.`,
      sqlColumn: `username`,
      column: table => table.string(`username`).notNullable().unique(),
      input: true,
      sortable: true,
      filter: { type: new GqlList(GqlString) }
    },
    password: {
      type: new GqlNonNull(GqlString),
      description: `A user's password.`,
      sqlColumn: `password`,
      column: table => table.string(`password`).notNullable().unique(),
      input: true
    },
    email: {
      type: new GqlNonNull(GqlEmail),
      description: `A user's email address.`,
      sqlColumn: `email`,
      column: table => table.string(`email`).notNullable().unique(),
      input: true,
      sortable: true,
      filter: { type: new GqlList(GqlEmail) }
    },
    profiles: {
      type: Profile,
      description: `A user's gender identity.`,
      sortable: true,
      args: { ...connectionArgs, ...ProfileFilter, ...ProfileOrder },
      junction: junction(`profiles`),
      where,
      orderBy,
      resolve: ({ profiles }, args) => connectionFromArray(profiles, args)
    },
    location: {
      type: GqlString,
      description: `A user's location.`,
      sqlColumn: `location`,
      column: table => table.string(`location`),
      input: true,
      sortable: true,
      filter: { type: new GqlList(GqlString) }
    },
    collection: {
      type: Collection,
      description: `A user's card collection.`,
      column: table => table.string(`collection`).notNullable(),
      input: { type: new GqlNonNull(GqlID) },
      args: { ...CollectionFilter, ...CollectionOrder },
      where,
      orderBy,
      sqlJoin: sqlJoin(`collection`)
    },
    token: {
      type: GqlString,
      description: `JSON Web Token for this User`
    }
  })
})

export const { connectionType: Connection } = connectionDefinitions({ nodeType: Definition })
export const Filter = createFilter(Definition)
export const Input = createInput(Definition)
export const Order = createOrder(Definition)

export const Queries = {
  user: {
    type: new GqlList(Definition),
    description: `Returns a User.`,
    args: { ...Filter, ...Order },
    where,
    orderBy,
    resolve: read
  }
}

export const Mutations = {
  updateUser: {
    type: Definition,
    description: `Updates an existing User, creates it if it does not already exist`,
    args: { ...Filter, ...Input },
    resolve: update
  },
  deleteUser: {
    type: Definition,
    description: `Deletes a User by id`,
    args: { id: { type: new GqlNonNull(GqlID) } },
    resolve: destroy
  },
  login: {
    type: new GqlObject({
      name: `login`,
      fields: {
        username: { type: GqlString },
        message:  { type: GqlString }
      }
    }),
    args: {
      email: { name: `email`, type: new GqlNonNull(GqlString) },
      password: { name: `password`, type: new GqlNonNull(GqlString) }
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
    type: new GqlObject({
      name: `register`,
      fields: {
        username: { type: GqlString },
        password: { type: GqlString },
        message:  { type: GqlString }
      }
    }),
    args: {
      email: { name: `email`, type: new GqlNonNull(GqlString) },
      password: { name: `password`, type: new GqlNonNull(GqlString) },
      username: { name: `username`, type: new GqlNonNull(GqlString) }
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

export {
  Definition as User,
  Connection as UserConnection,
  Filter as UserFilter,
  Input as UserInput,
  Order as UserOrder
}

export default { Definition, Queries, Mutations }
