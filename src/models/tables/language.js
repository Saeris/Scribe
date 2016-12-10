import db from '../../config/bookshelf.config'

export default class language extends db.Model {
  get tableName() {
   return 'language'
  }

  static fields(table) {
    // Fields
    table.bigIncrements(`id`)
         .notNullable()
         .primary()

    table.string(`name`)
         .comment(`The name of the language.`)
         .notNullable()

    table.bigInteger(`code`)
         .comment(`The language code associated with this language.`)
         .notNullable()
         .unsigned()
         .index(`language_code`)

    // Timestamps
    table.timestamps()
  }

  static foreignKeys(table) {
    table.foreign(`code`)
         .references(`id`)
         .inTable(`languagecode`)
         .onDelete(`NO ACTION`)
         .onUpdate(`NO ACTION`)
  }
}

export const Language = new language()
