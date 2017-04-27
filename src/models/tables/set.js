import moment from 'moment'
import db from '../../config/bookshelf.config'
import Icon from './icon'
import Block from './block'
import BlockSets from '../lists/blockSets'
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

    table.date(`releaseDate`)
         .comment(`The date on which the set was released.`)
         .notNullable()

    table.bigInteger(`booster`)
         .comment(`Booster pack generation rules for this set.`)
         .unsigned()
         .index(`booster`)

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

    table.foreign(`booster`)
         .references(`id`)
         .inTable(`booster`)
         .onDelete(`NO ACTION`)
         .onUpdate(`NO ACTION`)
  }

  // Bookshelf Relation Definitions
  get tableName() { return `set` }

  get hasTimestamps() { return true }

  block = () => this.belongsTo(Block, `block`).through(BlockSets, `id`, `set`, `block`)

  type = () => this.hasOne(SetType, `id`, `type`)

  icon = () => this.hasOne(Icon, `id`, `icon`)

  booster = () => this.hasOne(Booster, `id`, `booster`)

  toJSON() {
    let attrs = db.Model.prototype.toJSON.apply(this, arguments)
    attrs.releaseDate = moment(this.get(`releaseDate`)).format(`YYYY-MM-DD`)
    return attrs
  }
}
