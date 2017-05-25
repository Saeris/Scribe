require('babel-register') //eslint-disable-line
const config = require('./src/config/server.config').default //eslint-disable-line

module.exports = config.db
