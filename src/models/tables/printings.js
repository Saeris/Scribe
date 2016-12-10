import db from '../../config/bookshelf.config'

import Card from './card'
import Set from './set'

export default class printings extends db.Model {
  get tableName() {
   return 'printings'
  }

  static fields(table) {
    // Fields
    table.bigInteger(`card`)
         .comment(`The card associated with this printing.`)
         .notNullable()
         .unsigned()
         .index(`printings_card`)

    table.bigInteger(`set`)
         .comment(`The set associated with this printing.`)
         .notNullable()
         .unsigned()
         .index(`printings_set`)

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`card`, `set`])
  }

  static foreignKeys(table) {
    table.foreign(`set`)
         .references(`id`)
         .inTable(`set`)
         .onDelete(`NO ACTION`)
         .onUpdate(`NO ACTION`)
  }

  cardID() {
    return this.belongsTo(Card, "card")
  }

  set() {
    return this.belongsTo(Set, "set")
  }
}

export const Printings = new printings()
