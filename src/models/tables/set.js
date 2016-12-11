import db from '../../config/bookshelf.config'
import Icon from './icon'
import Block from './block'
import Booster from './booster'
import SetType from './setType'

export default class Set extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigIncrements(`id`)
         .notNullable()
         .primary()

    table.string(`name`)
         .comment(`The name of the set.`)
         .notNullable()

    table.string(`code`)
         .comment(`The set code.`)
         .notNullable()

    table.bigInteger(`block`)
         .comment(`The block the set belongs to.`)
         .notNullable()
         .unsigned()
         .index(`block`)

    table.bigInteger(`type`)
         .comment(`The type of the set.`)
         .notNullable()
         .unsigned()
         .index(`type`)

    table.bigInteger(`icon`)
         .comment(`The icon associated with the set.`)
         .notNullable()
         .unsigned()
         .index(`icon`)

    table.string(`border`)
         .comment(`The border color of the set.`)
         .notNullable()

    table.date(`releasedate`)
         .comment(`The date on which the set was released.`)
         .notNullable()

    // Timestamps
    table.timestamps()
  }

  static foreignKeys(table) {
    table.foreign(`block`)
         .references(`id`)
         .inTable(`block`)
         .onDelete(`NO ACTION`)
         .onUpdate(`NO ACTION`)

    table.foreign(`type`)
         .references(`id`)
         .inTable(`settype`)
         .onDelete(`NO ACTION`)
         .onUpdate(`NO ACTION`)

    table.foreign(`icon`)
         .references(`id`)
         .inTable(`icon`)
         .onDelete(`NO ACTION`)
         .onUpdate(`NO ACTION`)
  }

  // Bookshelf Relation Definitions
  get tableName() { return 'set' }

  get hasTimestamps() { return true }
}
