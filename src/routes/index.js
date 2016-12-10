import path from 'path'
import glob from 'glob' // https://github.com/isaacs/node-glob

export default (router) => {

  glob.sync(`${__dirname}/**/!(*.spec).js`)
    .forEach( file => {
      if(file !== `index.js`) {
        let filename = path.basename(file)
        let basename = filename.split('.')[0]
        let resource = require(file).default
        console.log(`✓ Loaded Resource: /${basename}`)

      }
    })

}
