import client from './apollo'
import gql from 'graphql-tag'
import chalk from 'chalk'
import present from 'present'
import moment from 'moment'

const { info, log, error } = console
const duration = ms => moment.utc(ms).format(`HH:mm:ss.SSS`)

export const getLanguages = async input => await client
  .query({
    query: gql`query getLanguageCode($input: [String]) {
      language(filter: { name: $input }) {
        id
        code
      }
    }`,
    variables: { input },
    fetchPolicy: `cache-first`
  })
  .then(res => res.data.language)
  .catch(err => log(`Failed to get Language Code.`, input,  err))

export const updateLanguage = input => client
  .mutate({
    mutation: gql`mutation updateLangauge($input: LanguageInput) {
      updateLanguage(input: $input) {
        id
      }
    }`,
    variables: { input }
  })
  .then(res => res.data.updateLanguage)
  .catch(err => log(`Failed to update Language.`, input,  err))

export const insertLanguages = async () => {
  const start = present()
  const prefix = `${chalk.green(`[insertLanguages]: `)}`
  try {
    log(`${prefix}Begin adding languages to database...`)
    const languages = [
      { code: `en-US`, name: `English`},
      { code: `zh-Hans`, name: `Chinese Simplified`},
      { code: `zh-Hant`, name: `Chinese Traditional`},
      { code: `fr`, name: `French`},
      { code: `de`, name: `German`},
      { code: `it`, name: `Italian`},
      { code: `ja`, name: `Japanese`},
      { code: `ko`, name: `Korean`},
      { code: `pt`, name: `Portuguese`},
      { code: `ru`, name: `Russian`},
      { code: `es`, name: `Spanish`},
      { code: `pt-br`, name: `Portuguese (Brazil)`}
    ]
    await Promise.all(languages.map(language => {
      info(`${prefix}Adding language ${chalk.green(language.name)}`)
      updateLanguage(language)
    }))
    .then(info(`${prefix}Finished adding Languages.`))
    .catch(err => error(`${prefix}Failed to add Languages.`, { err }))
    const end = present()
    log(`${prefix}Finished inserting languages! (${duration(end - start)})`)
  } catch (err) {
    const end = present()
    error(`${prefix}Failed to add languages to the database. (${duration(end - start)})`, err)
  }
}
