import { graphqlHapi } from "apollo-server-hapi" // https://github.com/apollographql/apollo-server
// https://www.howtographql.com/advanced/4-security/
import depthLimit from 'graphql-depth-limit' // https://github.com/stems/graphql-depth-limit
import queryComplexity from "graphql-query-complexity" // https://github.com/ivome/graphql-query-complexity
//import * as loaders from "@/loaders"
import * as Types from "@/types"
import * as Junctions from "@/junctions"
import { Model } from "@/database"
import { formatError } from "@/utilities"
import { schema } from "./schema"

const Models = Object.values(Types) // For each Type Definition
  .map(({ Definition }) => Definition) // Grab the Definition from the default export
  .filter(Type => !!Type) // Filter out undefined exports
  .reduce((hash, { _typeConfig: { sqlTable: tablename } }) => { // Reduce to a hash of Bookshelf Models
    hash[tablename] = Model.extend({
      tablename,
      useGlobalID: true,
      hasTimestamps: [`created`, `updated`],
      softDelete: true
    })
    return hash
  }, {})

// GraphQL Caching Examples:
// http://dev.apollodata.com/tools/graphql-tools/connectors.html#DataLoader-and-caching
// https://github.com/apollographql/GitHunt-API/blob/cc67a4506c31310b4ba8d811dda11d258c7d60d6/api/index.js#L67-L73
// https://github.com/apollographql/GitHunt-API/blob/cc67a4506c31310b4ba8d811dda11d258c7d60d6/api/sql/schema.js#L63
// https://github.com/apollographql/GitHunt-API/blob/cc67a4506c31310b4ba8d811dda11d258c7d60d6/api/github/connector.js

export default {
  plugin: graphqlHapi,
  options: {
    path: `/graphql`,
    graphqlOptions: ({ payload }) => {
      info(`Received query:`, payload)
      return {
        schema,
        context: {
          ...Models,
          ...Junctions
        },
        root_value: schema,
        formatError,
        validationRules: [
          depthLimit(10),
          queryComplexity({
            maximumComplexity: 2000,
            variables: payload?.[0]?.variables || payload?.variables || {},
            onComplete: complexity => { info(`Determined query complexity: ${complexity}`) },
            createError: (max, actual) =>
              new GqlError(`Query is too complex: ${actual}. Maximum allowed complexity: ${max}`)
          })
        ],
        tracing: true,
        debug: true
      }
    },
    route: {
      cors: true
    }
  }
}
