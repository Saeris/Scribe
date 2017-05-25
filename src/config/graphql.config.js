import Schema from '../schema'
import { formatError } from '../utilities'

class Graphql {
  // API Endpoint Settings
  api = {
    path: `/api`,
    graphqlOptions: request => {
      let options = {
        formatError : formatError,
        schema:       Schema,
        root_value:   Schema,
        debug:        true
      }
      return options
    },
    route: {
      plugins: {
        rateLimit: {
          enabled: true,
          rate: request => ({limit: 5000, window: 3600 })
        }
      }
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
