import moment from 'moment'
import db from '../../config/bookshelf.config'
import { Icon, Block, Booster, SetType } from './'
import { BlockSets } from '../lists'

export default class Set extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigIncrements(`id`)
         .notNullable()
         .unsigned()
         .primary()
         .unique()

    table.string(`name`)
         .comment(`The name of the set.`)
         .notNullable()
         .unique()

    table.string(`code`)
         .comment(`The set code.`)
         .notNullable()
         .unique()

    table.bigInteger(`block`)
         .comment(`The block the set belongs to.`)
         .unsigned()
         .index(`set_block`)

    table.bigInteger(`type`)
         .comment(`The type of the set.`)
         .notNullable()
         .unsigned()
         .index(`set_type`)

    table.bigInteger(`icon`)
         .comment(`The icon associated with the set.`)
         .notNullable()
         .unsigned()
         .index(`set_icon`)

    table.string(`border`)
         .comment(`The border color of the set.`)
         .notNullable()

    table.date(`releaseDate`)
         .comment(`The date on which the set was released.`)
         .notNullable()

    table.bigInteger(`booster`)
         .comment(`Booster pack generation rules for this set.`)
         .unsigned()
         .index(`set_booster`)

    // Timestamps
    table.timestamps()
  }

  // Bookshelf Relation Definitions
  get tableName() { return `set` }

  get hasTimestamps() { return true }

  block = () => this.belongsTo(Block, `block`).through(BlockSets, `id`, `block`, `set`)

  type = () => this.hasOne(SetType, `id`, `type`)

  icon = () => this.hasOne(Icon, `id`, `icon`)

  booster = () => this.hasOne(Booster, `id`, `booster`)

  toJSON() {
    let attrs = db.Model.prototype.toJSON.apply(this, arguments)
    attrs.releaseDate = moment(this.get(`releaseDate`)).format(`YYYY-MM-DD`)
    return attrs
  }
}
