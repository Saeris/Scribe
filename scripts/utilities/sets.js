import 'isomorphic-fetch'
import client from './apollo'
import gql from 'graphql-tag'
import chalk from 'chalk'
import present from 'present'
import moment from 'moment'
import { promiseMapAll } from './promiseMapAll'

const { info, log, error } = console
const BaseUrl = `https://api.magicthegathering.io/v1`

const duration = ms => moment.utc(ms).format(`HH:mm:ss.SSS`)

export const updateSet = async input => await client
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

export const updateSetType = async input => await client
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

export const updateSetIcon = async input => await client
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

export const updateBlock = async input => await client
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

export async function fetchSets() {
  try {
    const { sets } = await fetch(`${BaseUrl}/sets`).then(response => response.json())
    return sets
  } catch (err) {
    error(err)
  }
}

export const insertSets = async sets => {
  const start = present()
  const prefix = `${chalk.blue(`[insertSets]: `)}`
  try {
    log(`${prefix}Adding all sets to database`)
    let results = []
    for (let set of await sets) {
      info(`${prefix}Adding set ${chalk.green(set.name)}`)
      const code = set.code.toLowerCase()
      results.push(updateSet(await promiseMapAll({
        name:         set.name,
        code:         set.code,
        block:        !!set.block ? updateBlock({ name: set.block.toString() }) : null,
        type:         updateSetType({ name: set.type }),
        icon:         updateSetIcon({ name: code, class: `ss-${code}` }),
        border:       set.border,
        releaseDate:  moment(set.releaseDate).format(`YYYY-MM-DD`),
        booster:      null
      })))
    }
    const end = present()
    log(`${prefix}Finished inserting all sets! (${duration(end - start)})`)
    return await Promise.all(results)
  } catch (err) {
    const end = present()
    error(`${prefix}Failed to add all sets to the database. (${duration(end - start)})`, err)
  }
}
