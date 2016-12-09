import db from '../config/bookshelf.config'

export default class color extends db.Model {
  get tableName() {
   return 'color'
  }

  static fields(table) {
    // Fields
    table.bigIncrements(`id`)
         .notNullable()
         .primary()

    table.string(`symbol`)
         .comment(`The color symbol code for this color.`)
         .notNullable()

    table.bigInteger(`icon`)
         .comment(`The icon associated with the color.`)
         .notNullable()
         .unsigned()
         .index(`icon`)

    table.bigInteger(`identity`)
         .comment(`The color identity associated with the color.`)
         .notNullable()
         .unsigned()
         .index(`identity`)

    // Timestamps
    table.timestamps()
  }

  static foreignKeys(table) {
    table.foreign(`icon`)
         .references(`id`)
         .inTable(`icon`)
         .onDelete(`NO ACTION`)
         .onUpdate(`NO ACTION`)

    table.foreign(`identity`)
         .references(`id`)
         .inTable(`coloridentity`)
         .onDelete(`NO ACTION`)
         .onUpdate(`NO ACTION`)
  }
}

export const Color = new color()
