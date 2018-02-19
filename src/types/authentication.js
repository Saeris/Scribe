import argon2 from "argon2"
import jwt from "jsonwebtoken"
import { User } from "./user"

export const Definition = new GqlObject({
  name: `Authentication`,
  description: `Authentication Payload`,
  fields: () => ({
    token: {
      type: new GqlNonNull(GqlString),
      description: `JSON Web Token`
    },
    user: {
      type: new GqlNonNull(User),
      description: `The Authenticated User`
    }
  })
})

export const Queries = {
}

export const Mutations = {
  login: {
    type: Definition,
    args: {
      email: { type: new GqlNonNull(GqlString) },
      password: { type: new GqlNonNull(GqlString) }
    },
    resolve: async (parent, { email, password }, { user }) => {
      const account = await user.findOne({ where: { email } })
      if (!account) throw new Error(`No such user found for email: ${email}`)

      const valid = await argon2.verify(account.password, password)
      if (!valid) throw new Error(`Invalid password`)

      return {
        token: jwt.sign({ id: account.id, email: account.email }, PRIVATE_KEY),
        user: account
      }
    }
  },
  register: {
    type: Definition,
    args: {
      email: { type: new GqlNonNull(GqlString) },
      password: { type: new GqlNonNull(GqlString) },
      username: { type: new GqlNonNull(GqlString) }
    },
    resolve: async (parent, { email, password, username }, { user }) => {
      const account = await user.create({
        data: { username, email, password: await argon2.hash(password) }
      })

      return {
        token: jwt.sign({ id: account.id, email: account.email }, PRIVATE_KEY),
        user: account
      }
    }
  }
}

export {
  Definition as Authentication
}

export default { Definition, Queries, Mutations }
