import client from './apollo'
import gql from 'graphql-tag'
import chalk from 'chalk'
import present from 'present'
import moment from 'moment'

const duration = ms => moment.utc(ms).format(`HH:mm:ss.SSS`)

const updateLanguageCode = async input => await client
  .mutate({
    mutation: gql`mutation updateLanguageCode($input: LanguageCodeInput) {
      updateLanguageCode(input: $input) {
        id
      }
    }`,
    variables: { input }
  })
  .then(res => res.data.updateLanguageCode)
  .catch(err => console.log(`Failed to update Language Code.`, input,  err))

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
    varaibles: { input }
  })
  .then(res => res.data.language[0].code)
  .catch(err => console.log(`Failed to get Language Code.`, input,  err))

const updateLanguage = async input => await client
  .mutate({
    mutation: gql`mutation updateLangauge($input: LanguageInput) {
      updateLanguage(input: $input) {
        id
      }
    }`,
    variables: { input }
  })
  .then(res => res.data.updateLanguage)
  .catch(err => console.log(`Failed to update Language.`, input,  err))

export { updateLanguageCode, getLanguageCode, updateLanguage }

export async function insertLanguages() {
  const start = present()
  const prefix = `${chalk.green(`[insertLanguages]: `)}`
  try {
    console.log(`${prefix}Begin adding languages to database...`)
    let i = 1
    const languages = new Map([
      [`en-US`, `English`],
      [`zh-Hans`, `Chinese Simplified`],
      [`zh-Hant`, `Chinese Traditional`],
      [`fr`, `French`],
      [`de`, `German`],
      [`it`, `Italian`],
      [`ja`, `Japanese`],
      [`ko`, `Korean`],
      [`pt`, `Portuguese`],
      [`ru`, `Russian`],
      [`es`, `Spanish`],
      [`pt-br`, `Portuguese (Brazil)`]
    ])

    for (let [code, language] of languages) {
      console.info(`${prefix}Adding language ${chalk.green(language)}`)
      await updateLanguageCode({ code, language: i })
      await updateLanguage({name: language, code: i})
      i++
    }
    const end = present()
    console.log(`${prefix}Finished inserting languages! (${duration(end - start)})`)
  } catch (err) {
    const end = present()
    console.error(`${prefix}Failed to add languages to the database. (${duration(end - start)})`, err)
  }
}
