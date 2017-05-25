import webpack from 'webpack'
import path from 'path'
import fs from 'fs'
import dotenv  from 'dotenv' // https://github.com/motdotla/dotenv
import { generateConfig, stripMetadata } from '@easy-webpack/core'
import envDev from '@easy-webpack/config-env-development'
import babel from '@easy-webpack/config-babel'

dotenv.config()

process.env.BABEL_ENV = `webpack`
const ENV = process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() || (process.env.NODE_ENV = `development`)

const nodeModules = {}
fs.readdirSync(`node_modules`)
  .filter(x => [`.bin`].indexOf(x) === -1)
  .forEach(mod => nodeModules[mod] = `commonjs ` + mod)

// Main Webpack Configuration
const config = generateConfig(
  {
    entry: {
      'server': `./src/server`
    },
    target: `node`,
    output: {
      path: path.resolve(`dist`),
      filename: `server.js`
    },
    externals: nodeModules
  },

  ENV === `test` ? envDev({devtool: `inline-source-map`}) : envDev(),

  babel(),

  ENV === `production` ? {
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
          conditionals: true,
          unused: true,
          comparisons: true,
          sequences: true,
          dead_code: true,
          evaluate: true,
          join_vars: true,
          if_return: true
        },
        output: {
          comments: false
        }
      })
    ]} : { plugins: [
      new webpack.optimize.UglifyJsPlugin({
        beautify: true,
        mangle: false,
        dead_code: true,
        unused: true,
        compress: {
          keep_fnames: true,
          drop_debugger: false,
          dead_code: true,
          unused: true,
          warnings: false
        },
        comments: true
      })
    ]},

  ENV === `development` ? { performance: { hints: false } } : {},

  {
    module: {
      rules: [
        { test: /\.(graphql|gql)$/, exclude: /node_modules/, loader: `graphql-tag/loader` },
        { test: /\src\/images$/, loader: `ignore-loader` }
      ]
    },
    plugins: [
      new webpack.EnvironmentPlugin([
        `HTTP`,
        `HTTPS`,
        `LOGLEVEL`,
        `DB_HOST`,
        `DB_USERNAME`,
        `DB_PASSWORD`,
        `DB_NAME`,
        `LOGGLY_TOKEN`,
        `LOGGLY_SUBDOMAIN`,
        `DD_API_KEY`
      ]),
      new webpack.BannerPlugin({ banner: `require("source-map-support").install();`, raw: true, entryOnly: false })
    ]
  }
)

module.exports = stripMetadata(config)
