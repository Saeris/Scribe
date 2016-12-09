require('babel-register')
const config = require('./src/config/server.config').default

module.exports = config.db
