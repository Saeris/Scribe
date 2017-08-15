require('babel-core/register') //eslint-disable-line
require('babel-polyfill') //eslint-disable-line
const config = require('./src/config/server.config').default //eslint-disable-line

module.exports = config.db
