import db from '../config/bookshelf.config'

export default class colorIdentity extends db.Model {
  get tableName() {
   return 'colorIdentity'
  }

  static fields(table) {
    // Fields
    table.bigIncrements(`id`)
         .notNullable()
         .primary()

    table.string(`name`)
         .comment(`The name of the color identity.`)
         .notNullable()

    table.string(`alias`)
         .comment(`The alias of the color identity. Examples: Bant, Jeskai`)

    table.bigInteger(`colors`)
         .comment(`List of colors included in this color identity.`)
         .notNullable()
         .unsigned()
         .index(`colors`)

    table.boolean(`multicolored`)
         .comment(`True if the color identity has more than one color.`)
         .notNullable()

    table.boolean(`devoid`)
         .comment(`True if the color identity is ruled to be colorless.`)
         .notNullable()

    // Timestamps
    table.timestamps()
  }

  static foreignKeys(table) {
    table.foreign(`colors`)
         .references(`coloridentity`)
         .inTable(`colors`)
         .onDelete(`CASCADE`)
         .onUpdate(`NO ACTION`)
  }
}

export const ColorIdentity = new colorIdentity()
