import 'isomorphic-fetch'
import ApolloClient, { createBatchingNetworkInterface } from 'apollo-client'

const client = new ApolloClient({
  networkInterface: createBatchingNetworkInterface({
    uri: `http://localhost:1337/api`,
    batchInterval: 10
  }),
  queryDeduplication: true
})

export default client
