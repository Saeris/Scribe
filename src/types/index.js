import path from 'path'
import glob from 'glob' // https://github.com/isaacs/node-glob

export function loadTypes() {
  let types = []

  glob.sync(`${__dirname}/**/!(*.spec).js`).forEach( file => {
    let filename = path.basename(file)
    if (filename !== `index.js`) {
      types.push(require(file))
    }
  })

  return types
}

export function definitions() {
  let collection = {}

  loadTypes().forEach((type) => {
    collection[type.Definition.name] = type.Definition
    console.log(`✓ Loaded Type Definition: ${type.Definition.name}`)
  })

  return collection
}

export function queries() {
  let collection = []

  loadTypes().forEach((type) => {
    collection.push(type.Queries)
  })

  return collection
}

export function mutations() {
  let collection = []

  loadTypes().forEach((type) => {
    collection.push(type.Mutations)
  })

  return collection
}

export const Definitions = definitions()

export default Definitions
