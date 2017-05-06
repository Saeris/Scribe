import 'isomorphic-fetch'
import ApolloClient, { createNetworkInterface } from 'apollo-client'

const client = new ApolloClient({
  networkInterface: createNetworkInterface({
    uri: `http://localhost:1337/api`
  })
})

export default client
