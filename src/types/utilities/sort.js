import { GraphQLEnumType } from 'graphql'

const Sort = new GraphQLEnumType({
  name: `Sort`,
  description: `Sort options for OrderBy`,
  values: {
    ascending: { value: `asc` },
    descending: { value: `desc`}
  }
})

export default Sort
