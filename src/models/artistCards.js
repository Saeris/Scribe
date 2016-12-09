import db from '../config/bookshelf.config'

import Card from './card'
import Artist from './artist'

export default class artistCards extends db.Model {
  get tableName() {
   return `artistcards`
  }

  static fields(table) {
    // Fields
    table.bigInteger(`artist`)
         .comment(`The artist associated with this card.`)
         .notNullable()
         .unsigned()
         .index(`artist`)

    table.bigInteger(`card`)
         .comment(`The card associated with this artist.`)
         .notNullable()
         .unsigned()
         .index(`card`)

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`artist`, `card`])
  }

  static foreignKeys(table) {
    table.foreign(`card`)
         .references(`id`)
         .inTable(`card`)
         .onDelete(`NO ACTION`)
         .onUpdate(`NO ACTION`)
  }

  artist() {
    return this.belongsTo(Artist)
  }

  card() {
    return this.hasMany(Card)
  }
}

export const ArtistCards = new artistCards()
