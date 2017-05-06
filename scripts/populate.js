import chalk from 'chalk'
import present from 'present'
import moment from 'moment'
import {
  insertTypes, fetchTypes,
  insertColors,
  insertSets, fetchSets,
  insertLanguages,
  insertCards, fetchCards
} from './utilities'

const duration = ms => moment.utc(ms).format(`HH:mm:ss.SSS`)

async function populate() {
  try {
    const start = present()
    const prefix = `${chalk.green(`[populate]: `)}`
    console.log(`${prefix}Begin populating database...`)
    await insertTypes(await fetchTypes())
    console.log(`${prefix}Successfully added type data!`)
    await insertColors()
    console.log(`${prefix}Successfully added color data!`)
    let sets = await insertSets(await fetchSets())
    console.log(`${prefix}Successfully added set data!`)
    await insertLanguages()
    console.log(`${prefix}Successfully added language data!`)
    for (let set of sets) {
      await insertCards(await fetchCards(set.code), set)
      console.log(`${prefix}Successfully added cards for set ${set.code}`)
    }
    const end = present()
    console.log(`${prefix}Finished populating database! (${duration(end - start)})`)
  } catch (err) {
    console.error(err)
  }
}

populate()
