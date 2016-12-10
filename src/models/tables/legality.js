import db from '../../config/bookshelf.config'

export default class legality extends db.Model {
  get tableName() {
   return 'legality'
  }

  static fields(table) {
    // Indexes
    table.bigIncrements(`id`)
         .notNullable()
         .primary()

    // Fields
    table.bigInteger(`format`)
         .comment(`The format associated with this legality.`)
         .notNullable()
         .unsigned()
         .index(`legality_format`)

    table.boolean(`legal`)
         .comment(`True if the card is legal in the associated format.`)
         .notNullable()

    table.boolean(`restricted`)
         .comment(`True if the card is restricted in the associated format.`)
         .notNullable()

    table.bigInteger(`cards`)
         .comment(`List of cards that have this legality ruling.`)
         .notNullable()
         .unsigned()
         .index(`legality_cards`)

    // Timestamps
    table.timestamps()
  }

  static foreignKeys(table) {
    table.foreign(`format`)
         .references(`id`)
         .inTable(`format`)
         .onDelete(`NO ACTION`)
         .onUpdate(`NO ACTION`)

    table.foreign(`cards`)
         .references(`legality`)
         .inTable(`legalitycards`)
         .onDelete(`CASCADE`)
         .onUpdate(`NO ACTION`)
  }
}

export const Legality = new legality()
