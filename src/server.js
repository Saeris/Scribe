import 'babel-polyfill'
import hapi from 'hapi' // http://hapijs.com/api
//import jwt from 'hapi-auth-jwt2' // https://github.com/dwyl/hapi-auth-jwt2
import boomDecorators from 'hapi-boom-decorators' // https://github.com/brainsiq/hapi-boom-decorators
import statMon from 'hapijs-status-monitor' // https://github.com/ziyasal/hapijs-status-monitor
import { graphqlHapi, graphiqlHapi } from 'graphql-server-hapi' // http://dev.apollodata.com/tools/graphql-server
import good from 'good' // https://github.com/hapijs/good
import 'good-winston' // https://github.com/lancespeelmon/good-winston
import { configure, info, error } from 'winston'
import config from './config/server.config' // HTTP Server Settings
import graphql from './config/graphql.config' // GraphQL Settings
//import routes from './routes' // REST API Endpoints

configure(config.winston)

const server = new hapi.Server()

// Start the server
server.connection(config.http)

// Setup Boom Decorators
server.register({
  register: boomDecorators
})

server.register({
  register: statMon
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
  if (err) return error(err)
  info(`Bookshelf configured using: ${config.db.client}`)
  server.start(() => info(`Server started at ${ server.info.uri }`))
})
