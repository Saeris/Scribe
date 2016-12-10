import db from '../../config/bookshelf.config'

export default class keyword extends db.Model {
  get tableName() {
   return 'keyword'
  }

  static fields(table) {
    // Fields
    table.bigIncrements(`id`)
         .notNullable()
         .primary()

    table.string(`name`)
         .comment(`The name of the keyword.`)
         .notNullable()

    table.text(`description`)
         .comment(`The description of the keyword.`)

    table.bigInteger(`cards`)
         .comment(`A list of cards that have this keyword.`)
         .notNullable()
         .unsigned()
         .index(`keyword_cards`)

    // Timestamps
    table.timestamps()
  }

  static foreignKeys(table) {
    table.foreign(`cards`)
         .references(`keyword`)
         .inTable(`keywordcards`)
         .onDelete(`CASCADE`)
         .onUpdate(`NO ACTION`)
  }
}

export const Keyword = new keyword()
