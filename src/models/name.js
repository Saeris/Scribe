import db from '../config/bookshelf.config'

import Card from './card'

export default class name extends db.Model {
  get tableName() {
   return 'name'
  }

  static fields(table) {
    // Fields
    table.bigIncrements(`id`)
         .notNullable()
         .primary()

    table.string(`name`)
         .comment(`The localized name of the card.`)
         .notNullable()

    table.bigInteger(`language`)
         .comment(`The language code of the language the name is localized in.`)
         .notNullable()
         .unsigned()
         .index(`language`)

    table.bigInteger(`cards`)
         .comment(`A list of cards that have this name.`)
         .notNullable()
         .unsigned()
         .index(`cards`)

    // Timestamps
    table.timestamps()
  }

  static foreignKeys(table) {
    table.foreign(`language`)
         .references(`id`)
         .inTable(`languagecode`)
         .onDelete(`NO ACTION`)
         .onUpdate(`NO ACTION`)

    table.foreign(`cards`)
         .references(`name`)
         .inTable(`namecards`)
         .onDelete(`CASCADE`)
         .onUpdate(`NO ACTION`)
  }

  cardID() {
    return this.belongsTo(Card, "card")
  }
}

export const Name = new name()
