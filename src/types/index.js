import path from 'path'
import glob from 'glob' // https://github.com/isaacs/node-glob

export function loadTypes() {
  let types = []

  glob.sync(`${__dirname}/**/!(*.spec).js`).forEach( file => {
    let filename = path.basename(file)
    if(filename !== `index.js`) {
      types.push(require(file))
    }
  })

  return types
}

export function definitions() {
  let definitions = {}

  loadTypes().forEach((type) => {
    definitions[type.name] = type.Definition
    console.log(`✓ Loaded Type Definition: ${type.name}`)
  })

  return definitions
}

export function queries() {
  let queries = []

  loadTypes().forEach((type) => {
    queries.push(type.Queries)
  })

  return queries
}

export function mutations() {
  let mutations = []

  loadTypes().forEach((type) => {
    mutations.push(type.Mutations)
  })

  return mutations
}

export const Definitions = definitions()

export default Definitions
