import 'isomorphic-fetch'
import fs from 'fs'
import mkdirp from 'mkdirp'
import client from './apollo'
import gql from 'graphql-tag'
import chalk from 'chalk'
import present from 'present'
import moment from 'moment'
import { getSupertype, getType, getSubtype } from './types'
import { getColor, getColorIdentity } from './colors'
import { getLanguageCode } from './languages'

const BaseUrl = `https://api.magicthegathering.io/v1`

const duration = ms => moment.utc(ms).format(`HH:mm:ss.SSS`)

const updateCard = async (fields) => await client
  .mutate({
    mutation: gql`mutation updateCard($input: CardInput) {
      updateCard(input: $input) {
        id
      }
    }`,
    variables: { input: { ...fields } }
  })
  .then(res => res.data.updateCard.id)
  .catch(err => console.log(`Failed to update Card.`, err))

const updateName = async (name, language) => await client
  .mutate({
    mutation: gql`mutation updateName($input: NameInput) {
      updateName(input: $input) {
        id
      }
    }`,
    variables: { input: { name, language } }
  })
  .then(res => res.data.updateName.id)
  .catch(err => console.log(`Failed to update Name.`, err))

const fetchImage = async (url, set, num, language) => {
  const dir = `./src/images/sets/${set}`
  const image = `${dir}/${set}_${num}_${language}.jpg`

  if (fs.existsSync(image)) return image
  if (!fs.existsSync(dir)) mkdirp.sync(dir)

  fetch(url).then(resp => resp.body.pipe(fs.createWriteStream(image)))

  return image
}

const updateImage = async (url, multiverseid, language) => await client
  .mutate({
    mutation: gql`mutation updateImage($input: ImageInput) {
      updateImage(input: $input) {
        id
      }
    }`,
    variables: { input: { url, multiverseid, language } }
  })
  .then(res => res.data.updateImage.id)
  .catch(err => console.log(`Failed to update Image.`, err))

const updateArtist = async name => await client
  .mutate({
    mutation: gql`mutation updateArtist($input: ArtistInput) {
      updateArtist(input: $input) {
        id
      }
    }`,
    variables: { input: { name } }
  })
  .then(res => res.data.updateArtist.id)
  .catch(err => console.log(`Failed to update Artist.`, err))

const updateLayout = async name => await client
  .mutate({
    mutation: gql`mutation updateLayout($input: LayoutInput) {
      updateLayout(input: $input) {
        id
      }
    }`,
    variables: { input: { name } }
  })
  .then(res => res.data.updateLayout.id)
  .catch(err => console.log(`Failed to update Layout.`, err))

const updateRarity = async name => await client
  .mutate({
    mutation: gql`mutation updateRarity($input: RarityInput) {
      updateRarity(input: $input) {
        id
      }
    }`,
    variables: { input: { name: name, class: `ss-${name.toLowerCase()}` } }
  })
  .then(res => res.data.updateRarity.id)
  .catch(err => console.log(`Failed to update Rarity.`, err))

export { updateCard, updateName, updateImage, updateArtist, updateLayout, updateRarity }

export async function fetchCards(setCode) {
  const start = present()
  const prefix = `${chalk.cyan(`[fetchCards]: `)}`
  try {
    let page = 1
    let remaining
    let done = true
    let cards = []
    console.log(`${prefix}Fetching card data for set ${chalk.green(setCode)}...`)
    do {
      let response = await fetch(`${BaseUrl}/cards?set=${setCode}&page=${page}`).then(resp => resp)
      let data = await response.json()
      cards.push(...data.cards)
      let total = response.headers.get(`total-count`)
      remaining = total - (page * 100)
      console.info(`${prefix}Retrieved page ${page}: ${cards.length} of ${total} cards.`)
      remaining <= 0 ? done = false : page++
    } while (done)
    const end = present()
    console.log(`${prefix}Finished fetching cards for set ${chalk.green(setCode)}! (${duration(end - start)})`)
    return cards
  } catch (err) {
    const end = present()
    console.error(`${prefix}Failed to fetch all cards. (${duration(end - start)})`, err)
  }
}

export async function insertCards(cards, set) {
  const start = present()
  const prefix = `${chalk.magenta(`[insertCards]: `)}`
  console.log(`${prefix}Adding card data for set ${chalk.green(set.code)}`)
  try {
    let i = 1
    let results = []
    for (let card of await cards) {
      console.info(`${prefix}Adding card ${chalk.green(card.name)}`)
      if (!!!card.number) card.number = i
      i++
      card.set = set.id

      let names = []
      let srcImages = []

      if (!!card.multiverseid) {
        names.push(await updateName(card.name, 1))
        srcImages.push({ url: card.imageUrl, multiverseid: card.multiverseid, code: `en-US`, codeID: 1 })
      }
      if (!!card.foreignNames) {
        for (let name of card.foreignNames) {
          if (!!name.multiverseid) {
            let languageCode = await getLanguageCode(name.language)
            console.log(`Adding name: ${name.name}, language: ${name.language}, code: ${languageCode.id}`)
            names.push(await updateName(name.name, languageCode.id))
            srcImages.push({ url: card.imageUrl, multiverseid: card.multiverseid, code: languageCode.code, codeID: languageCode.id })
          }
        }
      }
      card.names = await names

      let images = []
      for (let image of srcImages) {
        images.push(await updateImage(await fetchImage(image.url, set.code, card.number, image.code), image.multiverseid, image.codeID))
      }
      card.images = await images

      card.layout = await updateLayout(card.layout)

      let colors = []
      if (!!card.colorIdentity) colors = card.colorIdentity.map(color => `"{${color}}"`)

      let colorIdentity = ``
      if (!!card.colorIdentity && !!card.colors) {
        for (let identity of card.colors) colorIdentity = `${colorIdentity}/${identity}`.substring(1)
      }

      card.colors = await getColor(colors)
      card.colorIdentity = await getColorIdentity(colorIdentity)

      let supertypes = []
      if (!!card.supertypes) supertypes = card.supertypes.map(supertype => `"${supertype}"`)
      card.supertypes = await getSupertype(supertypes)

      let types = []
      if (!!card.types) types = card.types.map(type => `"${type}"`)
      card.types = await getType(types)

      let subtypes = []
      if (!!card.subtypes) subtypes = card.subtypes.map(subtype => `"${subtype}"`)
      card.subtypes = await getSubtype(subtypes)

      card.rarity = await updateRarity(card.rarity)
      card.artist = await updateArtist(card.artist)

      results.push(await updateCard(new Card(card)))
    }
    const end = present()
    console.log(`${prefix}Finished inserting ${results.length} cards for set ${chalk.green(set.code)}! (${duration(end - start)})`)
    return results
  } catch (err) {
    const end = present()
    console.error(`${prefix}Failed to insert all cards for set ${chalk.green(set.code)}! (${duration(end - start)})`, err)
  }
}

class Card {
  constructor(data) {
    this.names           = data.names
    this.images          = data.images
    this.sides           = !!data.sides ? data.sides : null
    this.variations      = !!data.variations ? data.variations : null
    this.border          = !!data.border ? data.border : `Black`
    this.layout          = data.layout
    this.watermark       = !!data.watermark ? data.watermark : null
    this.manaCost        = !!data.manaCost ? data.manaCost : null
    this.cmc             = !!data.cmc ? data.cmc : 0
    this.colors          = data.colors
    this.colorIdentity   = !!data.colorIdentity ? data.colorIdentity : 6
    this.typeLine        = data.type
    this.originalType    = data.originalType
    this.supertypes      = data.supertypes
    this.types           = data.types
    this.subtypes        = data.subtypes
    this.rarity          = data.rarity
    this.set             = data.set
    this.text            = !!data.text ? data.text : null
    this.originalText    = !!data.originalText ? data.originalText : null
    this.categories      = null
    this.abilityTypes    = null
    this.keywords        = null
    this.flavor          = !!data.flavor ? data.flavor : null
    this.hand            = !!data.hand ? data.hand : null
    this.life            = !!data.life ? data.life : null
    this.power           = !!data.power ? data.power : null
    this.toughness       = !!data.toughness ? data.toughness : null
    this.loyalty         = !!data.loyalty ? data.loyalty : null
    this.legalities      = !!data.legalities ? data.legalities : null
    this.rulings         = !!data.rulings ? data.rulings : null
    this.artist          = data.artist
    this.number          = data.number
    this.releaseDate     = data.releaseDate
    this.printings       = !!data.printings ? data.printings : null
    this.timeshifted     = !!data.timeshifted ? data.timeshifted : false
    this.starter         = !!data.starter ? data.starter : false
    this.reserved        = !!data.reserved ? data.reserved : false
    this.source          = !!data.source ? data.source : null
  }
}
