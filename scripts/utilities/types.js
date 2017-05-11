import 'isomorphic-fetch'
import client from './apollo'
import gql from 'graphql-tag'
import chalk from 'chalk'
import present from 'present'
import moment from 'moment'

const BaseUrl = `https://api.magicthegathering.io/v1`

const duration = ms => moment.utc(ms).format(`HH:mm:ss.SSS`)

const updateType = async input => await client
  .mutate({
    mutation: gql`mutation updateType($input: TypeInput) {
      updateType(input: $input) {
        id
      }
    }`,
    variables: { input }
  })
  .then(res => res.data.updateType.id)
  .catch(err => console.log(`Failed to update Type.`, input,  err))

const getType = async input => await client
  .query({
    query: gql`query getType($input: [String]) {
      type(filter: { name: $input }) {
        id
      }
    }`,
    variables: { input }
  })
  .then(res => res.data.type.map(type => type.id))
  .catch(err => console.log(`Failed to get Type.`, input,  err))

const updateSubtype = async input => await client
  .mutate({
    mutation: gql`mutation updateSubtype($input: SubtypeInput) {
      updateSubtype(input: $input) {
        id
      }
    }`,
    variables: { input }
  })
  .then(res => res.data.updateSubtype.id)
  .catch(err => console.log(`Failed to update Subtype.`, input,  err))

const getSubtype = async input => await client
  .query({
    query: gql`query getSubtype($input: [String]) {
      subtype(filter: { name: $input }) {
        id
      }
    }`,
    variables: { input }
  })
  .then(res => res.data.subtype.map(subtype => subtype.id))
  .catch(err => console.log(`Failed to get Subtype.`, input,  err))

const updateSupertype = async input => await client
  .mutate({
    mutation: gql`mutation updateSupertype($input: SupertypeInput) {
      updateSupertype(input: $input) {
        id
      }
    }`,
    variables: { input }
  })
  .then(res => res.data.updateSupertype.id)
  .catch(err => console.log(`Failed to update Supertype.`, input,  err))

const getSupertype = async input => await client
  .query({
    query: gql`query getSupertype($input: [String]) {
      supertype(filter: { name: $input }) {
        id
      }
    }`,
    variables: { input }
  })
  .then(res => res.data.supertype.map(supertype => supertype.id))
  .catch(err => console.log(`Failed to get Supertype.`, input,  err))

export { updateSupertype, updateType, updateSubtype, getSupertype, getType, getSubtype }

export async function fetchTypes() {
  try {
    let supertypes = await fetch(`${BaseUrl}/supertypes`).then(response => response.json())
    let types = await fetch(`${BaseUrl}/types`).then(response => response.json())
    let subtypes = await fetch(`${BaseUrl}/subtypes`).then(response => response.json())
    return { ...supertypes, ...types, ...subtypes }
  } catch (err) {
    console.error(err)
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
    console.log(`${prefix}Adding all types to database.`)
    for (let supertype of types.supertypes) {
      console.info(`${prefix}Adding supertype ${chalk.green(supertype)}`)
      results.supertypes.push(await updateSupertype({ name: supertype }))
    }
    for (let type of types.types) {
      console.info(`${prefix}Adding type ${chalk.green(type)}`)
      results.types.push(await updateType({ name: type }))
    }
    for (let subtype of types.subtypes) {
      console.info(`${prefix}Adding subtype ${chalk.green(subtype)}`)
      results.subtypes.push(await updateSubtype({ name: subtype }))
    }
    const end = present()
    console.log(`${prefix}Finished inserting all types! (${duration(end - start)})`)
    return results
  } catch (err) {
    const end = present()
    console.error(`${prefix}Failed to add all types to the database. (${duration(end - start)})`, err)
  }
}
