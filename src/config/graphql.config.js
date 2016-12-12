import Schema from '../schema'

class Graphql {
  // API Endpoint Settings
  api = {
    path: `/api`,
    graphqlOptions: (request) => {
      let options = {
        schema:     Schema,
        root_value: Schema,
        debug:      true
      }
      return options
    }
  }

  // GraphiQL Editor Settings
  graphiql = {
    path: `/graphiql`,
    graphiqlOptions: {
      endpointURL: `/api`
    }
  }
}

export default new Graphql()
