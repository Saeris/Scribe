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
import { getLanguageCode } from './languages'

const BaseUrl = `https://api.magicthegathering.io/v1`
const { info, log, error } = console
const duration = ms => moment.utc(ms).format(`HH:mm:ss.SSS`)

const updateCard = async input => await client
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

const updatePrinting = async input => await client
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

const updateName = async input => await client
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

const fetchImage = async (url, set, num, language) => {
  if (!!!minimist(process.argv.slice(2)).getImages) return url

  const dir = `./src/images/sets/${set}`
  const image = `${dir}/${set}_${num}_${language}.jpg`

  if (fs.existsSync(image)) return image
  if (!fs.existsSync(dir)) mkdirp.sync(dir)

  await fetch(url).then(resp => resp.body.pipe(fs.createWriteStream(image)))

  return image
}

const updateImage = async input => await client
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

const updateArtist = async input => await client
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

const updateLayout = async input => await client
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

const updateRarity = async input => await client
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

export { updateCard, updateName, updateImage, updateArtist, updateLayout, updateRarity }

export async function fetchCards(setCode) {
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

export async function insertCards(cards, set) {
  const start = present()
  const prefix = `${chalk.magenta(`[insertCards]: `)}`
  log(`${prefix}Adding card data for set ${chalk.green(set.code)}`)
  try {
    let i = 1
    for (let card of await cards) {
      info(`${prefix}Adding card ${chalk.green(card.name)}`)
      const number = (!!card.number && card.number !== 0) ? card.number : i++

      let names = []
      let srcImages = []

      if (!!card.multiverseid) {
        names.push(await updateName({ name: card.name, language: 1 }))
        srcImages.push({ url: card.imageUrl, multiverseid: card.multiverseid, code: `en-US`, codeID: 1 })
      }
      if (!!card.foreignNames) {
        for (let name of card.foreignNames) {
          if (!!name.multiverseid) {
            const languageCode = await getLanguageCode([`${name.language}`])
            log(`Adding name: ${name.name}, language: ${name.language}, code: ${languageCode.code}`)
            names.push(await updateName({ name: name.name, language: languageCode.id }))
            srcImages.push({ url: name.imageUrl, multiverseid: name.multiverseid, code: languageCode.code, codeID: languageCode.id })
          }
        }
      }

      let images = []
      for (let image of srcImages) {
        images.push(await updateImage({
          url: await fetchImage(image.url, set.code, number, image.code),
          multiverseid: image.multiverseid,
          language: image.codeID
        }))
      }

      let colorIdentity = ``
      if (!!card.colorIdentity && !!card.colors) {
        for (let identity of card.colors) colorIdentity = `${colorIdentity}/${identity}`
      }

      const cardID = await updateCard({
        name:           card.name,
        names:          names,
        border:         !!card.border ? card.border : null,
        layout:         await updateLayout({ name:card.layout }),
        watermark:      null,
        manaCost:       !!card.manaCost ? card.manaCost : null,
        cmc:            !!card.cmc ? card.cmc : 0,
        colors:         !!card.colorIdentity ? await getColor(card.colorIdentity.map(color => `{${color}}`)) : null,
        colorIdentity:  colorIdentity !== `` ? await getColorIdentity([colorIdentity.substring(1)]) : 6,
        typeLine:       card.type,
        supertypes:     !!card.supertypes ? await getSupertype(card.supertypes.map(name => `${name}`)) : null,
        types:          !!card.types ? await getType(card.types.map(name => `${name}`)) : null,
        subtypes:       !!card.subtypes ? await getSubtype(card.subtypes.map(name => `${name}`)) : null,
        rarity:         await updateRarity({ name: card.rarity, class: `ss-${card.rarity.toLowerCase()}` }),
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
      })

      await updatePrinting({
        card:           cardID,
        set:            set.id,
        images:         images,
        artist:         await updateArtist({ name: card.artist }),
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
      })
    }
    const end = present()
    log(`${prefix}Finished inserting cards for set ${chalk.green(set.code)}! (${duration(end - start)})`)
  } catch (err) {
    const end = present()
    error(`${prefix}Failed to insert all cards for set ${chalk.green(set.code)}! (${duration(end - start)})`, err)
  }
}
