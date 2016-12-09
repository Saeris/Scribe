import db from '../config/bookshelf.config'

export default class layout extends db.Model {
  get tableName() {
   return 'layout'
  }

  static fields(table) {
    // Fields
    table.bigIncrements(`id`)
         .notNullable()
         .primary()

    table.string(`name`)
         .comment(`The name of the layout.`)
         .notNullable()

    table.bigInteger(`watermark`)
         .comment(`Watermark icon used in this layout.`)
         .unsigned()
         .index(`watermark`)

    table.bigInteger(`icons`)
         .comment(`List of icons used in this layout.`)
         .notNullable()
         .unsigned()
         .index(`icons`)

    // Timestamps
    table.timestamps()
  }

  static foreignKeys(table) {
    table.foreign(`icons`)
         .references(`layout`)
         .inTable(`icons`)
         .onDelete(`CASCADE`)
         .onUpdate(`NO ACTION`)
  }
}

export const Layout = new layout()
