import db from '../../config/bookshelf.config'

export default class colors extends db.Model {
  get tableName() {
   return 'colors'
  }

  static fields(table) {
    // Fields
    table.bigInteger(`coloridentity`)
         .comment(`The colorIdentity associated with the color.`)
         .notNullable()
         .unsigned()
         .index(`colors_coloridentity`)

    table.bigInteger(`color`)
         .comment(`The color associated with the colorIdentity.`)
         .notNullable()
         .unsigned()
         .index(`colors_color`)

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`coloridentity`, `color`])
  }

  static foreignKeys(table) {
      table.foreign(`color`)
           .references(`id`)
           .inTable(`color`)
           .onDelete(`NO ACTION`)
           .onUpdate(`NO ACTION`)
  }
}

export const Colors = new colors()
