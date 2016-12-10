import db from '../../config/bookshelf.config'

export default class formatSets extends db.Model {
  get tableName() {
   return 'formatsets'
  }

  static fields(table) {
    // Fields
    table.bigInteger(`format`)
         .comment(`The format associated with this set.`)
         .notNullable()
         .unsigned()
         .index(`formatSets_format`)

    table.bigInteger(`set`)
         .comment(`The set associated with this format.`)
         .notNullable()
         .unsigned()
         .index(`formatSets_set`)

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`format`, `set`])
  }

  static foreignKeys(table) {
    table.foreign(`set`)
         .references(`id`)
         .inTable(`set`)
         .onDelete(`NO ACTION`)
         .onUpdate(`NO ACTION`)
  }
}

export const FormatSets = new formatSets()
