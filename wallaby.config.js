module.exports = function(wallaby) {
  return {
    files: [{ pattern: `src/**/*.js`, load: false }, { pattern: `src/**/*.spec.js`, ignore: true }],
    tests: [`src/**/*.spec.js`],

    compilers: {
      "src/**/*.js": wallaby.compilers.babel({
        babel: require(`babel-core`),
        babelrc: true
      })
    },

    env: {
      type: `node`,
      runner: `node`,
      params: {
        // Specify Environment Variables Here
      }
    },

    testFramework: `jasmine`,

    debug: true
  }
}
