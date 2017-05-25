import db from '../../config/bookshelf.config'
import { Set } from './'
import { BlockSets } from '../lists'

export default class Block extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigIncrements(`id`)
      .notNullable()
      .unsigned()
      .primary()
      .unique()

    table.string(`name`)
      .comment(`The name of the block.`)
      .notNullable()
      .unique()

    // Timestamps
    table.timestamps()
  }

  // Bookshelf Relation Definitions
  get tableName() { return `block` }

  get hasTimestamps() { return true }

  sets = () => this.hasMany(Set, `id`).through(BlockSets, `id`, `block`, `set`)
}
