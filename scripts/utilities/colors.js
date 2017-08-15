import client from './apollo'
import gql from 'graphql-tag'
import chalk from 'chalk'
import present from 'present'
import moment from 'moment'

const { info, log, error } = console
const duration = ms => moment.utc(ms).format(`HH:mm:ss.SSS`)

export const getColor = async input => await client
  .query({
    query: gql`query getColor($input: [String]) {
      color(filter: {symbol: $input}) {
        id
      }
    }`,
    variables: { input },
    fetchPolicy: `cache-first`
  })
  .then(res => res.data.color.map(color => color.id))
  .catch(err => log(`Failed to get Color.`, input,  err))

export const getColorIdentity = async input => await client
  .query({
    query: gql`query getColorIdentity($input: [String]) {
      colorIdentity(filter: { name: $input }) {
        id
      }
    }`,
    variables: { input },
    fetchPolicy: `cache-first`
  })
  .then(res =>  res.data.colorIdentity.map(identity => identity.id))
  .catch(err => log(`Failed to get Color Identity.`, input,  err))

export const updateColorIcon = input => client
  .mutate({
    mutation: gql`mutation updateColorIcon($input: IconInput) {
      updateIcon(input: $input) {
        id
      }
    }`,
    variables: { input }
  })
  .then(res => res.data.updateIcon.id)
  .catch(err => log(`Failed to update Color Icon.`, input,  err))

export const updateColorIdentity = input => client
  .mutate({
    mutation: gql`mutation updateColorIdentity($input: ColorIdentityInput) {
      updateColorIdentity(input: $input) {
        id
      }
    }`,
    variables: { input }
  })
  .then(res => res.data.updateColorIdentity.id)
  .catch(err => log(`Failed to update Color Identity.`, input,  err))

export const updateColor = input => client
  .mutate({
    mutation: gql`mutation updateColor($input: ColorInput) {
      updateColor(input: $input) {
        id
      }
    }`,
    variables: { input }
  })
  .then(res => res.data.updateColor.id)
  .catch(err => log(`Failed to update Color.`, input,  err))

export const insertColors = async () => {
  const start = present()
  const prefix = `${chalk.red(`[insertColors]: `)}`
  try {
    log(`${prefix}Adding all colors and identities to database...`)
    const colorIdentities = [
      { name: `White`, alias: `White`, multicolored: false, devoid: false },
      { name: `Blue`, alias: `Blue`, multicolored: false, devoid: false },
      { name: `Black`, alias: `Black`, multicolored: false, devoid: false },
      { name: `Red`, alias: `Red`, multicolored: false, devoid: false },
      { name: `Green`, alias: `Green`, multicolored: false, devoid: false },
      { name: `Colorless`, alias: `Colorless`, multicolored: false, devoid: false },
      { name: `Devoid`, alias: `Devoid`, multicolored: false, devoid: true },
      { name: `Snow`, alias: `Snow`, multicolored: false, devoid: false },
      { name: `White/Blue`, alias: `Azorius Senate`, multicolored: true, devoid: false },
      { name: `Blue/Black`, alias: `House Dimir`, multicolored: true, devoid: false },
      { name: `Black/Red`, alias: `Cult of Rakdos`, multicolored: true, devoid: false },
      { name: `Red/Green`, alias: `Gruul Clans`, multicolored: true, devoid: false },
      { name: `White/Green`, alias: `Selesnya Conclave`, multicolored: true, devoid: false },
      { name: `White/Black`, alias: `Orzhov Syndicate`, multicolored: true, devoid: false },
      { name: `Blue/Red`, alias: `Izzet League`, multicolored: true, devoid: false },
      { name: `Black/Green`, alias: `Golgari Swarm`, multicolored: true, devoid: false },
      { name: `White/Red`, alias: `Boros Legion`, multicolored: true, devoid: false },
      { name: `Blue/Green`, alias: `Simic Combine`, multicolored: true, devoid: false },
      { name: `White/Blue/Green`, alias: `Bant`, multicolored: true, devoid: false },
      { name: `White/Blue/Black`, alias: `Esper`, multicolored: true, devoid: false },
      { name: `Blue/Black/Red`, alias: `Grixis`, multicolored: true, devoid: false },
      { name: `Black/Red/Green`, alias: `Jund`, multicolored: true, devoid: false },
      { name: `White/Red/Green`, alias: `Naya`, multicolored: true, devoid: false },
      { name: `White/Black/Green`, alias: `Abzan Houses`, multicolored: true, devoid: false },
      { name: `White/Blue/Red`, alias: `Jeskai Way`, multicolored: true, devoid: false },
      { name: `Blue/Black/Green`, alias: `Sultai Brood`, multicolored: true, devoid: false },
      { name: `White/Black/Red`, alias: `Mardu Horde`, multicolored: true, devoid: false },
      { name: `Blue/Red/Green`, alias: `Temur Frontier`, multicolored: true, devoid: false },
      { name: `White/Blue/Black/Red`, alias: `Artifice`, multicolored: true, devoid: false },
      { name: `Blue/Black/Red/Green`, alias: `Chaos`, multicolored: true, devoid: false },
      { name: `White/Black/Red/Green`, alias: `Aggression`, multicolored: true, devoid: false },
      { name: `White/Blue/Red/Green`, alias: `Altruism`, multicolored: true, devoid: false },
      { name: `White/Blue/Black/Green`, alias: `Growth`, multicolored: true, devoid: false },
      { name: `White/Blue/Black/Red/Green`, alias: `Chromatic`, multicolored: true, devoid: false }
    ]

    const colors = [
      { symbol: `{W}`, className: `ms-w`, name: `White` },
      { symbol: `{U}`, className: `ms-u`, name: `Blue` },
      { symbol: `{B}`, className: `ms-b`, name: `Black` },
      { symbol: `{R}`, className: `ms-r`, name: `Red` },
      { symbol: `{G}`, className: `ms-g`, name: `Green` },
      { symbol: `{C}`, className: `ms-c`, name: `Devoid` },
      { symbol: `{0}`, className: `ms-0`, name: `Colorless` },
      { symbol: `{1}`, className: `ms-1`, name: `Colorless` },
      { symbol: `{2}`, className: `ms-2`, name: `Colorless` },
      { symbol: `{3}`, className: `ms-3`, name: `Colorless` },
      { symbol: `{4}`, className: `ms-4`, name: `Colorless` },
      { symbol: `{5}`, className: `ms-5`, name: `Colorless` },
      { symbol: `{6}`, className: `ms-6`, name: `Colorless` },
      { symbol: `{7}`, className: `ms-7`, name: `Colorless` },
      { symbol: `{8}`, className: `ms-8`, name: `Colorless` },
      { symbol: `{9}`, className: `ms-9`, name: `Colorless` },
      { symbol: `{10}`, className: `ms-10`, name: `Colorless` },
      { symbol: `{11}`, className: `ms-11`, name: `Colorless` },
      { symbol: `{12}`, className: `ms-12`, name: `Colorless` },
      { symbol: `{13}`, className: `ms-13`, name: `Colorless` },
      { symbol: `{14}`, className: `ms-14`, name: `Colorless` },
      { symbol: `{15}`, className: `ms-15`, name: `Colorless` },
      { symbol: `{16}`, className: `ms-16`, name: `Colorless` },
      { symbol: `{17}`, className: `ms-17`, name: `Colorless` },
      { symbol: `{18}`, className: `ms-18`, name: `Colorless` },
      { symbol: `{19}`, className: `ms-19`, name: `Colorless` },
      { symbol: `{20}`, className: `ms-20`, name: `Colorless` },
      { symbol: `{100}`, className: `ms-100`, name: `Colorless` },
      { symbol: `{1000000}`, className: `ms-1000000`, name: `Colorless` },
      { symbol: `{infinity}`, className: `ms-infinity`, name: `Colorless` },
      { symbol: `{X}`, className: `ms-x`, name: `Colorless` },
      { symbol: `{Y}`, className: `ms-y`, name: `Colorless` },
      { symbol: `{Z}`, className: `ms-z`, name: `Colorless` },
      { symbol: `{S}`, className: `ms-s`, name: `Snow` },
      { symbol: `{W/U}`, className: `ms-wu ms-split`, name: `White/Blue` },
      { symbol: `{U/B}`, className: `ms-ub ms-split`, name: `Blue/Black` },
      { symbol: `{B/R}`, className: `ms-br ms-split`, name: `Black/Red` },
      { symbol: `{R/G}`, className: `ms-rg ms-split`, name: `Red/Green` },
      { symbol: `{G/W}`, className: `ms-gw ms-split`, name: `White/Green` },
      { symbol: `{W/B}`, className: `ms-wb ms-split`, name: `White/Black` },
      { symbol: `{U/R}`, className: `ms-ur ms-split`, name: `Blue/Red` },
      { symbol: `{B/G}`, className: `ms-bg ms-split`, name: `Black/Green` },
      { symbol: `{R/W}`, className: `ms-rw ms-split`, name: `White/Red` },
      { symbol: `{G/U}`, className: `ms-gu ms-split`, name: `Blue/Green` },
      { symbol: `{2/W}`, className: `ms-2w ms-split`, name: `White` },
      { symbol: `{2/U}`, className: `ms-2u ms-split`, name: `Blue` },
      { symbol: `{2/B}`, className: `ms-2b ms-split`, name: `Black` },
      { symbol: `{2/R}`, className: `ms-2r ms-split`, name: `Red` },
      { symbol: `{2/G}`, className: `ms-2g ms-split`, name: `Green` },
      { symbol: `{W/P}`, className: `ms-wp ms-split`, name: `White` },
      { symbol: `{U/P}`, className: `ms-up ms-split`, name: `Blue` },
      { symbol: `{B/P}`, className: `ms-bp-split`, name: `Black` },
      { symbol: `{R/P}`, className: `ms-rp ms-split`, name: `Red` },
      { symbol: `{G/P}`, className: `ms-gp ms-split`, name: `Green` }
    ]

    let identityIDs = []
    for (let { name, alias, multicolored, devoid } of colorIdentities) {
      info(`${prefix}Adding color identity ${chalk.green(alias)}`)
      identityIDs.push(updateColorIdentity({ name, alias, multicolored, devoid }))
    }
    identityIDs = await Promise.all(identityIDs)
      .then(info(`${prefix}Finished adding Color Identities.`))
      .catch(err => error(`${prefix}Failed to add Color Identities.`, { err }))

    let colorIDs = []
    for (let { symbol, className, name } of colors) {
      info(`${prefix}Adding color ${chalk.green(symbol)}`)
      const colorIdentityID = await getColorIdentity([name])
      const icon = await updateColorIcon({ name: symbol, class: className })
      colorIDs.push(updateColor({ symbol, icon, identity: colorIdentityID[0] }))
    }
    colorIDs = await Promise.all(colorIDs)
      .then(info(`${prefix}Finished adding Colors.`))
      .catch(err => error(`${prefix}Failed to add Colors.`, { err }))

    const end = present()
    log(`${prefix}Finished inserting all colors and identities! (${duration(end - start)})`)
  } catch (err) {
    const end = present()
    error(`${prefix}Failed to add all colors and identities to the database. (${duration(end - start)})`, err)
  }
}
