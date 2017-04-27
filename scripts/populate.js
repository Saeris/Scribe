import fetch from 'node-fetch'
import Lokka from 'lokka'
import Transport from 'lokka-transport-http'
import values from 'lodash/values'

const BaseUrl = `https://api.magicthegathering.io/v1`

const client = new Lokka({
  transport: new Transport(`http://localhost:1337/api`)
})

class Card {
  constructor(data) {
    Object.assign(this, data)
  }
}

class Set {
  constructor(data) {
    this.name = data.name
    this.code  = data.code
    this.block  = !!data.block ? data.block : null
    this.type  = data.type
    this.icon  = data.icon
    this.border  = data.border
    this.releaseDate = data.releaseDate
    this.booster = null
  }
}

async function getCards(config = {}) {
  let parameters = {
    set: toList(`set`, config.set),
    page: toField(`page`, config.page),
    pageSize: toField(`pageSize`, config.pageSize)
  }
  let query = values(parameters).filter(string => string !== ``).join(`&`)
  let request = `${BaseUrl}/cards?${encodeURI(query)}`
  let data = await fetch(request).then(response => response.json())
  let results = []
  data.cards.forEach(card => results.push(new Card(card)))
  return results
}

async function fetchSets() {
  try {
    let data = await fetch(`${BaseUrl}/sets`).then(response => response.json())
    return data.sets
  } catch (err) {
    console.log(err)
  }
}

async function insertSets(sets) {
  try {
    let results = []
    for (let set of await sets) {
      set.type = await upsertSetType(set.type)
      set.icon = await upsertSetIcon(set.code.toLowerCase())
      //!!set.block ? set.block = await upsertBlock(set.block.toString()) : null
      results.push(await upsertSet(new Set(set)))
    }
    return results
  } catch (err) {
    console.log(err)
  }
}

async function upsertSet(set) {
  const mutation = `($input: SetInput) {
    updateSet(input: $input) {
      id
    }
  }`
  return await client.mutate(mutation, { input: set }).then(resp => resp.updateSet.id)
}

async function upsertSetType(name) {
  const mutation = `($input: SetTypeInput) {
    updateSetType(input: $input) {
      id
    }
  }`
  return await client.mutate(mutation, { input: { name } }).then(resp => resp.updateSetType.id)
}

async function upsertSetIcon(code) {
  const mutation = `($input: IconInput) {
    updateIcon(input: $input) {
      id
    }
  }`
  return await client.mutate(mutation, { input: { name: code, class: `ss-${code}` } }).then(resp => resp.updateIcon.id)
}

async function upsertBlock(name) {
  const mutation = `($input: BlockInput) {
    updateBlock(input: $input) {
      id
    }
  }`
  console.log(name)
  return await client.mutate(mutation, { input: { name } }).then(resp => resp.updateBlock.id)
}

async function fetchTypes() {
  try {
    let subtypes = await fetch(`${BaseUrl}/subtypes`).then(response => response.json())
    let supertypes = await fetch(`${BaseUrl}/supertypes`).then(response => response.json())
    let types = await fetch(`${BaseUrl}/types`).then(response => response.json())
    return {...subtypes, ...supertypes, ...types}
  } catch (err) {
    console.log(err)
  }
}

async function insertTypes(data) {
  try {
    let results = {
      subtypes: [],
      supertypes: [],
      types: []
    }
    let types = await data
    for (let subtype of types.subtypes) {
      results.subtypes.push(await upsertSubtype(subtype))
    }
    for (let supertype of types.supertypes) {
      results.supertypes.push(await upsertSupertype(supertype))
    }
    for (let type of types.types) {
      results.types.push(await upsertType(type))
    }
    return results
  } catch (err) {
    console.log(err)
  }
}

async function upsertType(name) {
  const mutation = `($input: TypeInput) {
    updateType(input: $input) {
      id
    }
  }`
  return await client.mutate(mutation, { input: { name } }).then(resp => resp.updateType)
}

async function upsertSubtype(name) {
  const mutation = `($input: SubtypeInput) {
    updateSubtype(input: $input) {
      id
    }
  }`
  return await client.mutate(mutation, { input: { name } }).then(resp => resp.updateSubtype)
}

async function upsertSupertype(name) {
  const mutation = `($input: SupertypeInput) {
    updateSupertype(input: $input) {
      id
    }
  }`
  return await client.mutate(mutation, { input: { name } }).then(resp => resp.updateSupertype)
}

async function getFormats() {
  let data = await fetch(`/formats`).then(response => response.json())
  return data.formats
}

function toField(parameter, data) {
  return ((data !== ``) && (typeof data !== `undefined`)) ? `${parameter}=${data}` : `` || ``
}

function toList(parameter, data) {
  if (Array.isArray(data)) {
    return `${parameter}=${data.join()}`
  } else if ((data !== ``) && (typeof data !== `undefined`)) {
    return `${parameter}=${data}`
  }
  return ``
}

async function populate() {
  try {
    let sets = await insertSets(fetchSets())
    let types = await insertTypes(fetchTypes())
    console.log(sets)
    console.log(types)
    /*
    console.log(`Successfully added ${types.supertypes.length()} Supertypes.`)
    console.log(`Successfully added ${types.types.length()} Types.`)
    console.log(`Successfully added ${types.subtypes.length()} Subtypes.`)
    */
  } catch (err) {
    console.log(err)
  }
}

populate()
