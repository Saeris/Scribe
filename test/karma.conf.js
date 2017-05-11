import testRunnerConfig from 'test-runner-config'

let karmaFiles = testRunnerConfig.getKarmaFiles(files)

export default (config) => {
  config.set({
    basePath: __dirname,
    frameworks: [`jasmine`],
    exclude: [ ],
    files: karmaFiles.files,
    reporters: [ `mocha` ],
    port: 47357,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: [`Chrome_no_sandbox`],
    customLaunchers: {
      Chrome_no_sandbox: {
        base: `Chrome`,
        flags: [`--no-sandbox`]
      }
    },
    singleRun: true
  })
}
