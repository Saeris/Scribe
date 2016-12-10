import db from '../../config/bookshelf.config'

export default class blockSets extends db.Model {
  get tableName() {
   return 'blocksets'
  }

  static fields(table) {
    // Fields
    table.bigInteger(`block`)
         .comment(`The block associated with this set.`)
         .notNullable()
         .unsigned()
         .index(`blockSets_block`)

    table.bigInteger(`set`)
         .comment(`The set associated with this block.`)
         .notNullable()
         .unsigned()
         .index(`blockSets_set`)

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`block`, `set`])
  }

  static foreignKeys(table) {
    table.foreign(`set`)
         .references(`id`)
         .inTable(`set`)
         .onDelete(`CASCADE`)
         .onUpdate(`NO ACTION`)
  }
}

export const BlockSets = new blockSets()
