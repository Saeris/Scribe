// http://billpatrianakos.me/blog/2015/12/01/organizing-express-routes/
import path from 'path'
import glob from 'glob' // https://github.com/isaacs/node-glob
import { Router } from 'express'

export default (router) => {
  let api = Router()
  glob.sync(`${__dirname}/**/!(*.spec).js`)
    .forEach( file => {
      if(file !== `index.js`) {
        let filename = path.basename(file)
        let basename = filename.split('.')[0]
        let resource = require(file).default
        console.log(`✓ Loaded Resource: /${basename}`)
        api.use(`/${basename}`, resource)
      }
    })
  return api
}
