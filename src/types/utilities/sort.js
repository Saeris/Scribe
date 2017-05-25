import { GraphQLEnumType } from 'graphql'

export const sort = new GraphQLEnumType({
  name: `Sort`,
  description: `Sort options for OrderBy`,
  values: {
    ascending: { value: `asc` },
    descending: { value: `desc`}
  }
})
