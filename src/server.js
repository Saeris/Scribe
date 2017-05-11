import hapi from 'hapi' // http://hapijs.com/api
// jwt from 'hapi-auth-jwt2' // https://github.com/dwyl/hapi-auth-jwt2
import boomDecorators from 'hapi-boom-decorators' // https://github.com/brainsiq/hapi-boom-decorators
import { graphqlHapi, graphiqlHapi } from 'graphql-server-hapi' // http://dev.apollodata.com/tools/graphql-server
import good from 'good' // https://github.com/hapijs/good
import 'good-winston' // https://github.com/lancespeelmon/good-winston
import config from './config/server.config' // HTTP Server Settings
import graphql from './config/graphql.config' // GraphQL Settings
//import routes from './routes' // REST API Endpoints

const server = new hapi.Server()

// Start the server
server.connection(config.http)

// Setup Boom Decorators
server.register({
  register: boomDecorators
})

// Register the Public GraphQL API Endpoint
server.register({
  register: graphqlHapi,
  options: graphql.api
})

// Register the GrahiQL Editor Endpoint
server.register({
  register: graphiqlHapi,
  options: graphql.graphiql
})

// Setup Logging and Start the Server
server.register({
  register: good,
  options: config.good
}, (err) => {
  if (err) {
    return console.error(err)
  }

  server.start(() => {
    console.info(`Server started at ${ server.info.uri }`)
  })
})
