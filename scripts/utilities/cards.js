import 'isomorphic-fetch'
import fs from 'fs'
import mkdirp from 'mkdirp'
import client from './apollo'
import gql from 'graphql-tag'
import chalk from 'chalk'
import present from 'present'
import moment from 'moment'
import minimist from 'minimist'
import { getSupertype, getType, getSubtype } from './types'
import { getColor, getColorIdentity } from './colors'
import { getLanguages } from './languages'
import { promiseMapAll } from './promiseMapAll'

const BaseUrl = `https://api.magicthegathering.io/v1`
const { info, log, error } = console
const duration = ms => moment.utc(ms).format(`HH:mm:ss.SSS`)

export const updateCard = async input => await client
  .mutate({
    mutation: gql`mutation updateCard($input: CardInput) {
      updateCard(input: $input) {
        id
      }
    }`,
    variables: { input }
  })
  .then(res => res.data.updateCard.id)
  .catch(err => log(`Failed to update Card.`, input, err))

export const updatePrinting = async input => await client
  .mutate({
    mutation: gql`mutation updatePrinting($input: PrintingInput) {
      updatePrinting(input: $input) {
        id
      }
    }`,
    variables: { input }
  })
  .then(res => res.data.updatePrinting.id)
  .catch(err => log(`Failed to update Printing.`, input, err))

export const updateName = async input => await client
  .mutate({
    mutation: gql`mutation updateName($input: NameInput) {
      updateName(input: $input) {
        id
      }
    }`,
    variables: { input: input }
  })
  .then(res => res.data.updateName.id)
  .catch(err => log(`Failed to update Name.`, input, err))

export const fetchImage = async (url, set, num, language) => {
  if (!minimist(process.argv.slice(2)).getImages) return url

  const dir = `./src/images/sets/${set}`
  const image = `${dir}/${set}_${num}_${language}.jpg`

  if (fs.existsSync(image)) return image
  if (!fs.existsSync(dir)) mkdirp.sync(dir)

  await fetch(url).then(resp => resp.body.pipe(fs.createWriteStream(image)))

  return image
}

export const updateImage = async input => await client
  .mutate({
    mutation: gql`mutation updateImage($input: ImageInput) {
      updateImage(input: $input) {
        id
      }
    }`,
    variables: { input }
  })
  .then(res => res.data.updateImage.id)
  .catch(err => log(`Failed to update Image.`, input, err))

export const updateArtist = async input => await client
  .mutate({
    mutation: gql`mutation updateArtist($input: ArtistInput) {
      updateArtist(input: $input) {
        id
      }
    }`,
    variables: { input }
  })
  .then(res => res.data.updateArtist.id)
  .catch(err => log(`Failed to update Artist.`, input, err))

export const updateLayout = async input => await client
  .mutate({
    mutation: gql`mutation updateLayout($input: LayoutInput) {
      updateLayout(input: $input) {
        id
      }
    }`,
    variables: { input }
  })
  .then(res => res.data.updateLayout.id)
  .catch(err => log(`Failed to update Layout.`, input, err))

export const updateRarity = async input => await client
  .mutate({
    mutation: gql`mutation updateRarity($input: RarityInput) {
      updateRarity(input: $input) {
        id
      }
    }`,
    variables: { input }
  })
  .then(res => res.data.updateRarity.id)
  .catch(err => log(`Failed to update Rarity.`, input, err))

export const fetchCards = async setCode => {
  const start = present()
  const prefix = `${chalk.cyan(`[fetchCards]: `)}`
  try {
    let page = 1
    let remaining
    let done = true
    let cards = []
    log(`${prefix}Fetching card data for set ${chalk.green(setCode)}...`)
    do {
      let response = await fetch(`${BaseUrl}/cards?set=${setCode}&page=${page}`).then(resp => resp)
      let data = await response.json()
      cards.push(...data.cards)
      let total = response.headers.get(`total-count`)
      remaining = total - (page * 100)
      info(`${prefix}Retrieved page ${page}: ${cards.length} of ${total} cards.`)
      remaining <= 0 ? done = false : page++
    } while (done)
    const end = present()
    log(`${prefix}Finished fetching cards for set ${chalk.green(setCode)}! (${duration(end - start)})`)
    return cards
  } catch (err) {
    const end = present()
    error(`${prefix}Failed to fetch all cards. (${duration(end - start)})`, err)
  }
}

export const insertCards = async (cards, set) => {
  const start = present()
  const prefix = `${chalk.magenta(`[insertCards]: `)}`
  log(`${prefix}Adding card data for set ${chalk.green(set.code)}`)
  try {
    let i = 1
    client.resetStore()
    //let previousCard = ``
    //let insertQueue = []
    for (let card of await cards) {
      // TODO: Add support for sides/variations.
      /*
      if (Array.isArray(card.name) || card.name === previousCard) {

      } else {

      }
      */
      info(`${prefix}Adding card ${chalk.green(card.name)}`)
      const number = (!!card.number && card.number !== 0) ? card.number : i++

      let srcLanguages = []
      let names = []
      let images = []

      if (!!card.multiverseid) {
        srcLanguages.push(`English`)
        names.push({ name: card.name })
        images.push({ url: card.imageUrl, multiverseid: card.multiverseid })
      }

      if (!!card.foreignNames) {
        let previousLang = ``
        for (let name of card.foreignNames) {
          if (!!name.multiverseid) {
            if (name.language !== previousLang) {
              // TODO: Since Foreign Names include each image variation, add support
              // to map the correct image to the matching variation.
              previousLang = name.language
              srcLanguages.push(name.language)
              names.push({ name: name.name })
              images.push({ url: name.imageUrl, multiverseid: name.multiverseid })
            }
          }
        }
      }

      let languages = await getLanguages(srcLanguages)
      await Promise.all(languages.map(async (language, index) => {
        names[index].language = language.id
        images[index].url = await fetchImage(images[index].url, set.code, number, language.code)
        images[index].language = language.id
      }))

      let colorIdentity = ``
      if (!!card.colorIdentity && !!card.colors) {
        for (let identity of card.colors) colorIdentity = `${colorIdentity}/${identity}`
      }

      const cardID = await updateCard(await promiseMapAll({
        name:           card.name,
        names:          Promise.all(names.map(name => updateName(name))),
        border:         !!card.border ? card.border : null,
        layout:         updateLayout({ name:card.layout }),
        watermark:      null,
        manaCost:       !!card.manaCost ? card.manaCost : null,
        cmc:            !!card.cmc ? card.cmc : 0,
        colors:         !!card.colorIdentity ? getColor(card.colorIdentity.map(color => `{${color}}`)) : null,
        colorIdentity:  colorIdentity !== `` ? getColorIdentity([colorIdentity.substring(1)]) : 6,
        typeLine:       card.type,
        supertypes:     !!card.supertypes ? getSupertype(card.supertypes.map(name => `${name}`)) : null,
        types:          !!card.types ? getType(card.types.map(name => `${name}`)) : null,
        subtypes:       !!card.subtypes ? getSubtype(card.subtypes.map(name => `${name}`)) : null,
        rarity:         updateRarity({ name: card.rarity, class: `ss-${card.rarity.toLowerCase()}` }),
        text:           !!card.text ? card.text : null,
        categories:     null,
        abilityTypes:   null,
        keywords:       null,
        hand:           !!card.hand ? card.hand : null,
        life:           !!card.life ? card.life : null,
        power:          !!card.power ? card.power : null,
        toughness:      !!card.toughness ? card.toughness : null,
        loyalty:        !!card.loyalty ? card.loyalty : null,
        legalities:     [],
        rulings:        []
      }))

      const printingData = {
        card:           cardID,
        set:            set.id,
        images:         Promise.all(images.map(image => updateImage(image))),
        artist:         updateArtist({ name: card.artist }),
        sides:          [],
        variations:     [],
        originalType:   card.originalType,
        originalText:   !!card.originalText ? card.originalText : null,
        flavor:         !!card.flavor ? card.flavor : null,
        number:         number,
        timeshifted:    !!card.timeshifted ? card.timeshifted : false,
        starter:        !!card.starter ? card.starter : false,
        reserved:       !!card.reserved ? card.reserved : false,
        source:         !!card.source ? card.source : null
      }

      await updatePrinting(await promiseMapAll(printingData))
    }
    const end = present()
    log(`${prefix}Finished inserting cards for set ${chalk.green(set.code)}! (${duration(end - start)})`)
  } catch (err) {
    const end = present()
    error(`${prefix}Failed to insert all cards for set ${chalk.green(set.code)}! (${duration(end - start)})`, err)
  }
}
