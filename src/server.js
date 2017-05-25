import 'babel-polyfill'
import { promisifyAll } from 'bluebird'
import hapi from 'hapi' // http://hapijs.com/api
//import jwt from 'hapi-auth-jwt2' // https://github.com/dwyl/hapi-auth-jwt2
import boomDecorators from 'hapi-boom-decorators' // https://github.com/brainsiq/hapi-boom-decorators
import statMon from 'hapijs-status-monitor' // https://github.com/ziyasal/hapijs-status-monitor
import { graphqlHapi, graphiqlHapi } from 'graphql-server-hapi' // http://dev.apollodata.com/tools/graphql-server
import good from 'good' // https://github.com/hapijs/good
import 'good-winston' // https://github.com/lancespeelmon/good-winston
import { configure, info, error } from 'winston'
import scooter from 'scooter' // https://github.com/hapijs/scooter
//import blankie from 'blankie' // https://github.com/nlf/blankie
import hapiError from 'hapi-error' // https://github.com/dwyl/hapi-error
//import rateLimiter from 'hapi-rate-limiter' // https://github.com/lob/hapi-rate-limiter/
import cron from 'hapi-cron' // https://github.com/antonsamper/hapi-cron
import redis from 'redis' // https://github.com/NodeRedis/node_redis
import config from './config/server.config' // HTTP Server Settings
import graphql from './config/graphql.config' // GraphQL Settings
//import routes from './routes' // REST API Endpoints

configure(config.winston)
promisifyAll(redis.RedisClient.prototype)
promisifyAll(redis.Multi.prototype)

const redisClient = redis.createClient(config.redis)
redisClient.config(`SET`, `stop-writes-on-bgsave-error`, `no`)

// NOTE: https://gist.github.com/kapkaev/4619127
redisClient.on(`error`, err => error(err))

const server = new hapi.Server()

server.connection(config.http)

const plugins = [
  { register: boomDecorators },
  { register: good, options: config.good },
  { register: statMon },
  scooter,
  //{ register: blankie, options: config.csp },
  { register: hapiError, options: config.error },
  //{ register: rateLimiter, options: config.rateLimit(redisClient) },
  { register: graphqlHapi, options: graphql.api },
  { register: graphiqlHapi, options: graphql.graphiql },
  { register: cron, options: config.cron }
]

server.register(plugins, (err) => {
  if (err) return error(err)
  info(`Bookshelf configured using: ${config.db.client}`)
  server.start(() => info(`Server started at ${ server.info.uri }`))
})
