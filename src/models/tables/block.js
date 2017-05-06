import db from '../../config/bookshelf.config'
import { Set } from './'
import { BlockSets } from '../lists'

export default class Block extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigIncrements(`id`)
         .notNullable()
         .primary()

    table.string(`name`)
         .comment(`The name of the block.`)
         .notNullable()

    // Timestamps
    table.timestamps()
  }

  static foreignKeys(table) {
    table.foreign(`id`)
         .references(`block`)
         .inTable(`blockSets`)
         .onDelete(`CASCADE`)
         .onUpdate(`NO ACTION`)
  }

  // Bookshelf Relation Definitions
  get tableName() { return `block` }

  get hasTimestamps() { return true }

  sets = () => this.hasMany(Set, `id`).through(BlockSets, `id`, `block`, `set`)
}
