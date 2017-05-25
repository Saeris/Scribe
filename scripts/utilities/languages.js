import client from './apollo'
import gql from 'graphql-tag'
import chalk from 'chalk'
import present from 'present'
import moment from 'moment'

const { info, log, error } = console
const duration = ms => moment.utc(ms).format(`HH:mm:ss.SSS`)

const updateLanguageCode = input => client
  .mutate({
    mutation: gql`mutation updateLanguageCode($input: LanguageCodeInput) {
      updateLanguageCode(input: $input) {
        id
      }
    }`,
    variables: { input }
  })
  .then(res => res.data.updateLanguageCode)
  .catch(err => log(`Failed to update Language Code.`, input,  err))

const getLanguageCode = async input => await client
  .query({
    query: gql`query getLanguageCode($input: [String]) {
      language(filter: { name: $input }) {
        id
        code {
          id
          code
        }
      }
    }`,
    variables: { input },
    fetchPolicy: `cache-first`
  })
  .then(res => res.data.language[0].code)
  .catch(err => log(`Failed to get Language Code.`, input,  err))

const updateLanguage = input => client
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

export { updateLanguageCode, getLanguageCode, updateLanguage }

export async function insertLanguages() {
  const start = present()
  const prefix = `${chalk.green(`[insertLanguages]: `)}`
  try {
    log(`${prefix}Begin adding languages to database...`)
    const languages = [
      { code: `en-US`, language: `English`},
      { code: `zh-Hans`, language: `Chinese Simplified`},
      { code: `zh-Hant`, language: `Chinese Traditional`},
      { code: `fr`, language: `French`},
      { code: `de`, language: `German`},
      { code: `it`, language: `Italian`},
      { code: `ja`, language: `Japanese`},
      { code: `ko`, language: `Korean`},
      { code: `pt`, language: `Portuguese`},
      { code: `ru`, language: `Russian`},
      { code: `es`, language: `Spanish`},
      { code: `pt-br`, language: `Portuguese (Brazil)`}
    ]
    await Promise.all(languages.map(({code, language}, index) => {
      info(`${prefix}Adding language ${chalk.green(language)}`)
      updateLanguageCode({ code, language: index })
      updateLanguage({ name: language, code: index })
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
