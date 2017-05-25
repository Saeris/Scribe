import client from './apollo'
import gql from 'graphql-tag'
import chalk from 'chalk'
import present from 'present'
import moment from 'moment'

const { info, log, error } = console
const duration = ms => moment.utc(ms).format(`HH:mm:ss.SSS`)

const getColor = async input => await client
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

const getColorIdentity = async input => await client
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

const updateColorIcon = input => client
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

const updateColorIdentity = input => client
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

const updateColor = input => client
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

export { getColor, getColorIdentity, updateColorIcon, updateColorIdentity, updateColor }

export async function insertColors() {
  const start = present()
  const prefix = `${chalk.red(`[insertColors]: `)}`
  try {
    log(`${prefix}Adding all colors and identities to database...`)
    const colorIdentities = [
      { name: `White`, alias: `White`, colorList: [1], multicolored: false, devoid: false },
      { name: `Blue`, alias: `Blue`, colorList: [2], multicolored: false, devoid: false },
      { name: `Black`, alias: `Black`, colorList: [3], multicolored: false, devoid: false },
      { name: `Red`, alias: `Red`, colorList: [4], multicolored: false, devoid: false },
      { name: `Green`, alias: `Green`, colorList: [5], multicolored: false, devoid: false },
      { name: `Colorless`, alias: `Colorless`, colorList: Array(33 - 6 + 1).fill().map((_, i) => 6 + i), multicolored: false, devoid: false },
      { name: `Devoid`, alias: `Devoid`, colorList: [6], multicolored: false, devoid: true },
      { name: `Snow`, alias: `Snow`, colorList: [34], multicolored: false, devoid: false },
      { name: `White/Blue`, alias: `Azorius Senate`, colorList: [1, 2], multicolored: true, devoid: false },
      { name: `Blue/Black`, alias: `House Dimir`, colorList: [2, 3], multicolored: true, devoid: false },
      { name: `Black/Red`, alias: `Cult of Rakdos`, colorList: [3, 4], multicolored: true, devoid: false },
      { name: `Red/Green`, alias: `Gruul Clans`, colorList: [4, 5], multicolored: true, devoid: false },
      { name: `White/Green`, alias: `Selesnya Conclave`, colorList: [5, 1], multicolored: true, devoid: false },
      { name: `White/Black`, alias: `Orzhov Syndicate`, colorList: [1, 3], multicolored: true, devoid: false },
      { name: `Blue/Red`, alias: `Izzet League`, colorList: [2, 4], multicolored: true, devoid: false },
      { name: `Black/Green`, alias: `Golgari Swarm`, colorList: [3, 5], multicolored: true, devoid: false },
      { name: `White/Red`, alias: `Boros Legion`, colorList: [4, 1], multicolored: true, devoid: false },
      { name: `Blue/Green`, alias: `Simic Combine`, colorList: [5, 2], multicolored: true, devoid: false },
      { name: `White/Blue/Green`, alias: `Bant`, colorList: [5, 1, 2], multicolored: true, devoid: false },
      { name: `White/Blue/Black`, alias: `Esper`, colorList: [1, 2, 3], multicolored: true, devoid: false },
      { name: `Blue/Black/Red`, alias: `Grixis`, colorList: [2, 3, 4], multicolored: true, devoid: false },
      { name: `Black/Red/Green`, alias: `Jund`, colorList: [3, 4, 5], multicolored: true, devoid: false },
      { name: `White/Red/Green`, alias: `Naya`, colorList: [4, 5, 1], multicolored: true, devoid: false },
      { name: `White/Black/Green`, alias: `Abzan Houses`, colorList: [1, 3, 5], multicolored: true, devoid: false },
      { name: `White/Blue/Red`, alias: `Jeskai Way`, colorList: [2, 4, 1], multicolored: true, devoid: false },
      { name: `Blue/Black/Green`, alias: `Sultai Brood`, colorList: [3, 5, 2], multicolored: true, devoid: false },
      { name: `White/Black/Red`, alias: `Mardu Horde`, colorList: [4, 1, 3], multicolored: true, devoid: false },
      { name: `Blue/Red/Green`, alias: `Temur Frontier`, colorList: [5, 2, 4], multicolored: true, devoid: false },
      { name: `White/Blue/Black/Red`, alias: `Artifice`, colorList: [1, 2, 3, 4], multicolored: true, devoid: false },
      { name: `Blue/Black/Red/Green`, alias: `Chaos`, colorList: [2, 3, 4, 5], multicolored: true, devoid: false },
      { name: `White/Black/Red/Green`, alias: `Aggression`, colorList: [3, 4, 5, 1], multicolored: true, devoid: false },
      { name: `White/Blue/Red/Green`, alias: `Altruism`, colorList: [4, 5, 1, 2], multicolored: true, devoid: false },
      { name: `White/Blue/Black/Green`, alias: `Growth`, colorList: [5, 1, 2, 3], multicolored: true, devoid: false },
      { name: `White/Blue/Black/Red/Green`, alias: `Chromatic`, colorList: [1, 2, 3, 4, 5], multicolored: true, devoid: false }
    ]

    const colors = [
      { symbol: `{W}`, className: `ms-w`, identity: 1 },
      { symbol: `{U}`, className: `ms-u`, identity: 2 },
      { symbol: `{B}`, className: `ms-b`, identity: 3 },
      { symbol: `{R}`, className: `ms-r`, identity: 4 },
      { symbol: `{G}`, className: `ms-g`, identity: 5 },
      { symbol: `{C}`, className: `ms-c`, identity: 7 },
      { symbol: `{0}`, className: `ms-0`, identity: 6 },
      { symbol: `{1}`, className: `ms-1`, identity: 6 },
      { symbol: `{2}`, className: `ms-2`, identity: 6 },
      { symbol: `{3}`, className: `ms-3`, identity: 6 },
      { symbol: `{4}`, className: `ms-4`, identity: 6 },
      { symbol: `{5}`, className: `ms-5`, identity: 6 },
      { symbol: `{6}`, className: `ms-6`, identity: 6 },
      { symbol: `{7}`, className: `ms-7`, identity: 6 },
      { symbol: `{8}`, className: `ms-8`, identity: 6 },
      { symbol: `{9}`, className: `ms-9`, identity: 6 },
      { symbol: `{10}`, className: `ms-10`, identity: 6 },
      { symbol: `{11}`, className: `ms-11`, identity: 6 },
      { symbol: `{12}`, className: `ms-12`, identity: 6 },
      { symbol: `{13}`, className: `ms-13`, identity: 6 },
      { symbol: `{14}`, className: `ms-14`, identity: 6 },
      { symbol: `{15}`, className: `ms-15`, identity: 6 },
      { symbol: `{16}`, className: `ms-16`, identity: 6 },
      { symbol: `{17}`, className: `ms-17`, identity: 6 },
      { symbol: `{18}`, className: `ms-18`, identity: 6 },
      { symbol: `{19}`, className: `ms-19`, identity: 6 },
      { symbol: `{20}`, className: `ms-20`, identity: 6 },
      { symbol: `{100}`, className: `ms-100`, identity: 6 },
      { symbol: `{1000000}`, className: `ms-1000000`, identity: 6 },
      { symbol: `{infinity}`, className: `ms-infinity`, identity: 6 },
      { symbol: `{X}`, className: `ms-x`, identity: 6 },
      { symbol: `{Y}`, className: `ms-y`, identity: 6 },
      { symbol: `{Z}`, className: `ms-z`, identity: 6 },
      { symbol: `{S}`, className: `ms-s`, identity: 8 },
      { symbol: `{W/U}`, className: `ms-wu ms-split`, identity: 9 },
      { symbol: `{U/B}`, className: `ms-ub ms-split`, identity: 10 },
      { symbol: `{B/R}`, className: `ms-br ms-split`, identity: 11 },
      { symbol: `{R/G}`, className: `ms-rg ms-split`, identity: 12 },
      { symbol: `{G/W}`, className: `ms-gw ms-split`, identity: 13 },
      { symbol: `{W/B}`, className: `ms-wb ms-split`, identity: 14 },
      { symbol: `{U/R}`, className: `ms-ur ms-split`, identity: 15 },
      { symbol: `{B/G}`, className: `ms-bg ms-split`, identity: 16 },
      { symbol: `{R/W}`, className: `ms-rw ms-split`, identity: 17 },
      { symbol: `{G/U}`, className: `ms-gu ms-split`, identity: 18 },
      { symbol: `{2/W}`, className: `ms-2w ms-split`, identity: 1 },
      { symbol: `{2/U}`, className: `ms-2u ms-split`, identity: 2 },
      { symbol: `{2/B}`, className: `ms-2b ms-split`, identity: 3 },
      { symbol: `{2/R}`, className: `ms-2r ms-split`, identity: 4 },
      { symbol: `{2/G}`, className: `ms-2g ms-split`, identity: 5 },
      { symbol: `{W/P}`, className: `ms-wp ms-split`, identity: 1 },
      { symbol: `{U/P}`, className: `ms-up ms-split`, identity: 2 },
      { symbol: `{B/P}`, className: `ms-bp-split`, identity: 3 },
      { symbol: `{R/P}`, className: `ms-rp ms-split`, identity: 4 },
      { symbol: `{G/P}`, className: `ms-gp ms-split`, identity: 5 }
    ]

    await Promise.all(colorIdentities.map(({ name, alias, colorList, multicolored, devoid }) => {
      info(`${prefix}Adding color identity ${chalk.green(alias)}`)
      updateColorIdentity({ name, alias, colors: colorList, multicolored, devoid })
    }))
    .then(info(`${prefix}Finished adding Color Identities.`))
    .catch(err => error(`${prefix}Failed to add Color Identities.`, { err }))

    await Promise.all(colors.map(async ({ symbol, className, identity }) => {
      info(`${prefix}Adding color ${chalk.green(symbol)}`)
      const icon = await updateColorIcon({ name: symbol, class: className })
      updateColor({ symbol, icon, identity })
    }))
    .then(info(`${prefix}Finished adding Colors.`))
    .catch(err => error(`${prefix}Failed to add Colors.`, { err }))
    const end = present()
    log(`${prefix}Finished inserting all colors and identities! (${duration(end - start)})`)
  } catch (err) {
    const end = present()
    error(`${prefix}Failed to add all colors and identities to the database. (${duration(end - start)})`, err)
  }
}
