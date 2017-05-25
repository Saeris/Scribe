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

const { log, error } = console
const duration = ms => moment.utc(ms).format(`HH:mm:ss.SSS`)

async function populate() {
  try {
    const start = present()
    const prefix = `${chalk.green(`[populate]: `)}`
    log(`${prefix}Begin populating database...`)
    await insertTypes(await fetchTypes())
    log(`${prefix}Successfully added type data!`)
    await insertColors()
    log(`${prefix}Successfully added set data!`)
    await insertLanguages()
    log(`${prefix}Successfully added color data!`)
    const sets = await insertSets(await fetchSets())
    log(`${prefix}Successfully added language data!`)
    for (let set of sets) {
      await insertCards(await fetchCards(set.code), set)
      log(`${prefix}Successfully added cards for set ${set.code}`)
    }
    const end = present()
    log(`${prefix}Finished populating database! (${duration(end - start)})`)
  } catch (err) {
    error(err)
  }
}

populate()
