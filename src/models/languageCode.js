import db from '../config/bookshelf.config'

export default class languageCode extends db.Model {
  get tableName() {
   return 'languagecode'
  }

  static fields(table) {
    // Fields
    table.bigIncrements(`id`)
         .notNullable()
         .primary()

    table.string(`code`)
         .comment(`The language code.`)
         .notNullable()

    table.bigInteger(`language`)
         .comment(`The language associated with the language code.`)
         .notNullable()
         .unsigned()
         .index(`language`)

    // Timestamps
    table.timestamps()
  }

  static foreignKeys(table) {
    table.foreign(`language`)
         .references(`id`)
         .inTable(`language`)
         .onDelete(`NO ACTION`)
         .onUpdate(`NO ACTION`)
  }
}

export const LanguageCode = new languageCode()
