import 'isomorphic-fetch'
import client from './apollo'
import gql from 'graphql-tag'
import chalk from 'chalk'
import present from 'present'
import moment from 'moment'

const BaseUrl = `https://api.magicthegathering.io/v1`
const { info, log, error } = console
const duration = ms => moment.utc(ms).format(`HH:mm:ss.SSS`)

const updateType = input => client
  .mutate({
    mutation: gql`mutation updateType($input: TypeInput) {
      updateType(input: $input) {
        id
      }
    }`,
    variables: { input }
  })
  .then(res => res.data.updateType.id)
  .catch(err => log(`Failed to update Type.`, input,  err))

const getType = async input => await client
  .query({
    query: gql`query getType($input: [String]) {
      type(filter: { name: $input }) {
        id
      }
    }`,
    variables: { input },
    fetchPolicy: `cache-first`
  })
  .then(res => res.data.type.map(type => type.id))
  .catch(err => log(`Failed to get Type.`, input,  err))

const updateSubtype = input => client
  .mutate({
    mutation: gql`mutation updateSubtype($input: SubtypeInput) {
      updateSubtype(input: $input) {
        id
      }
    }`,
    variables: { input }
  })
  .then(res => res.data.updateSubtype.id)
  .catch(err => log(`Failed to update Subtype.`, input,  err))

const getSubtype = async input => await client
  .query({
    query: gql`query getSubtype($input: [String]) {
      subtype(filter: { name: $input }) {
        id
      }
    }`,
    variables: { input },
    fetchPolicy: `cache-first`
  })
  .then(res => res.data.subtype.map(subtype => subtype.id))
  .catch(err => log(`Failed to get Subtype.`, input,  err))

const updateSupertype = input => client
  .mutate({
    mutation: gql`mutation updateSupertype($input: SupertypeInput) {
      updateSupertype(input: $input) {
        id
      }
    }`,
    variables: { input }
  })
  .then(res => res.data.updateSupertype.id)
  .catch(err => log(`Failed to update Supertype.`, input,  err))

const getSupertype = async input => await client
  .query({
    query: gql`query getSupertype($input: [String]) {
      supertype(filter: { name: $input }) {
        id
      }
    }`,
    variables: { input },
    fetchPolicy: `cache-first`
  })
  .then(res => res.data.supertype.map(supertype => supertype.id))
  .catch(err => log(`Failed to get Supertype.`, input,  err))

export { updateSupertype, updateType, updateSubtype, getSupertype, getType, getSubtype }

export async function fetchTypes() {
  try {
    let supertypes = await fetch(`${BaseUrl}/supertypes`).then(response => response.json())
    let types = await fetch(`${BaseUrl}/types`).then(response => response.json())
    let subtypes = await fetch(`${BaseUrl}/subtypes`).then(response => response.json())
    return { ...supertypes, ...types, ...subtypes }
  } catch (err) {
    error(err)
  }
}

export async function insertTypes(data) {
  const start = present()
  const prefix = `${chalk.yellow(`[insertTypes]: `)}`
  try {
    let results = {
      subtypes: [],
      supertypes: [],
      types: []
    }
    let types = await data
    log(`${prefix}Adding all types to database.`)

    results.supertypes = await Promise
      .all(types.supertypes.map(supertype => {
        info(`${prefix}Adding Supertype ${chalk.green(supertype)}`)
        return updateSupertype({ name: supertype })
      }))
      .then(info(`${prefix}Finished adding Supertypes`))
      .catch(err => error(`${prefix}Failed to add Supertypes.`, { err }))

    results.types = await Promise
      .all(types.types.map(type => {
        info(`${prefix}Adding Type ${chalk.green(type)}`)
        return updateType({ name: type })
      }))
      .then(info(`${prefix}Finished adding Types`))
      .catch(err => error(`${prefix}Failed to add Types.`, { err }))

    results.types = await Promise
      .all(types.subtypes.map(subtype => {
        info(`${prefix}Adding Subtype ${chalk.green(subtype)}`)
        return updateSubtype({ name: subtype })
      }))
      .then(info(`${prefix}Finished adding Subtypes`))
      .catch(err => error(`${prefix}Failed to add Subtypes.`, { err }))

    const end = present()
    log(`${prefix}Finished inserting all types! (${duration(end - start)})`)
    return results
  } catch (err) {
    const end = present()
    error(`${prefix}Failed to add all types to the database. (${duration(end - start)})`, err)
  }
}
