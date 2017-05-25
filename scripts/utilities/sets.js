import 'isomorphic-fetch'
import client from './apollo'
import gql from 'graphql-tag'
import chalk from 'chalk'
import present from 'present'
import moment from 'moment'

const { info, log, error } = console
const BaseUrl = `https://api.magicthegathering.io/v1`

const duration = ms => moment.utc(ms).format(`HH:mm:ss.SSS`)

const updateSet = async input => await client
  .mutate({
    mutation: gql`mutation updateSet($input: SetInput) {
      updateSet(input: $input) {
        id
        code
      }
    }`,
    variables: { input }
  })
  .then(res => res.data.updateSet)
  .catch(err => log(`Failed to update Set.`, input,  err))

const updateSetType = async input => await client
  .mutate({
    mutation: gql`mutation updateSetType($input: SetTypeInput) {
      updateSetType(input: $input) {
        id
      }
    }`,
    variables: { input }
  })
  .then(res => res.data.updateSetType.id)
  .catch(err => log(`Failed to update Set Type.`, input, err))

const updateSetIcon = async input => await client
  .mutate({
    mutation: gql`mutation updateIcon($input: IconInput) {
      updateIcon(input: $input) {
        id
      }
    }`,
    variables: { input }
  })
  .then(res => res.data.updateIcon.id)
  .catch(err => log(`Failed to update Set Icon.`, input, err))

const updateBlock = async input => await client
  .mutate({
    mutation: gql`mutation updateBlock($input: BlockInput) {
      updateBlock(input: $input) {
        id
      }
    }`,
    variables: { input }
  })
  .then(res => res.data.updateBlock.id)
  .catch(err => log(`Failed to update Block.`, input, err))

export { updateSet, updateSetType, updateSetIcon, updateBlock }

export async function fetchSets() {
  try {
    let data = await fetch(`${BaseUrl}/sets`).then(response => response.json())
    return data.sets
  } catch (err) {
    error(err)
  }
}

export async function insertSets(sets) {
  const start = present()
  const prefix = `${chalk.blue(`[insertSets]: `)}`
  try {
    log(`${prefix}Adding all sets to database`)
    let results = []
    for (let set of await sets) {
      info(`${prefix}Adding set ${chalk.green(set.name)}`)
      const code = set.code.toLowerCase()
      set.type = await updateSetType({ name: set.type })
      set.icon = await updateSetIcon({ name: code, class: `ss-${code}` })
      if (!!set.block) set.block = await updateBlock({ name: set.block.toString() })
      results.push(await updateSet(new Set(set)))
    }
    const end = present()
    log(`${prefix}Finished inserting all sets! (${duration(end - start)})`)
    return results
  } catch (err) {
    const end = present()
    error(`${prefix}Failed to add all sets to the database. (${duration(end - start)})`, err)
  }
}

class Set {
  constructor(data) {
    this.name         = data.name
    this.code         = data.code
    this.block        = !!data.block ? data.block : null
    this.type         = data.type
    this.icon         = data.icon
    this.border       = data.border
    this.releaseDate  = moment(data.releaseDate).format(`YYYY-MM-DD`)
    this.booster      = null
  }
}
