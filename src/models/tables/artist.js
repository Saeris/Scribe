import db from '../../config/bookshelf.config'

import Card from './card'
import ArtistCards from './artistCards'

export default class artist extends db.Model {
  get tableName() {
   return `artist`
  }

  static fields(table) {
    // Fields
    table.bigIncrements(`id`)
         .notNullable()
         .primary()

    table.string(`name`)
         .comment(`The name of the artist.`)
         .notNullable()

    table.text(`website`)
         .comment(`The website of the artist, if they have one.`)

    table.bigInteger(`cards`)
         .comment(`The cards associated with this artist.`)
         .notNullable()
         .unsigned()
         .index(`artist_cards`)

    // Timestamps
    table.timestamps()
  }

  static foreignKeys(table) {
    table.foreign(`cards`)
         .references(`artist`)
         .inTable(`artistcards`)
         .onDelete(`CASCADE`)
         .onUpdate(`NO ACTION`)
  }

  card() {
    return this.belongsTo(Card, 'artist')
  }

  cards() {
    return this.hasMany(Card, `card`)
               .through(ArtistCards)
  }
}

export const Artist = new artist()
