import fetch from 'node-fetch'
import Lokka from 'lokka'
import Transport from 'lokka-transport-http'
import values from 'lodash/values'

const BaseUrl = `https://api.magicthegathering.io/v1`

const client = new Lokka({
  transport: new Transport(`http://localhost:1337/api`)
})

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

async function getSets(config = {}) {
  let data = await fetch(`${BaseUrl}/sets`).then(response => response.json())
  data.sets.forEach(set => {
    let result = new Set(set)
    console.log(result)
  })
}

async function getTypes(config = `types`) {
  let data = await fetch(`/${config}`).then(response => response.json())
  return data[config]
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

class Card {
  constructor(data) {
    Object.assign(this, data)
  }
}

class Set {
  constructor(data) {
    this.name = data.name
    this.code  = data.code
    this.block  = this.getBlock(data.block)
    this.type  = this.getSetType(data.type)
    this.icon  = this.getIcon(data.code)
    this.border  = data.border
    this.releaseDate = data.releaseDate
    this.booster = this.getBooster(data.booster)
  }

  getBlock(block) {
    return null
  }

  getSetType(name) {
    const mutation = `($input: SetTypeInput) {
      createSetType(input: $input) {
        id
        name
      }
    }`

    client.mutate(mutation, { input: { name } }).then(resp => {
      console.log(resp)
    })

    return null
  }

  getIcon(code) {
    return null
  }

  getBooster(booster) {
    return null
  }
}

getSets()
