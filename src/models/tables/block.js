import db from '../../config/bookshelf.config'
import Set from './set'
import BlockSets from '../lists/blockSets'

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

    table.bigInteger(`sets`)
         .comment(`List of sets that are included in this block.`)
         .notNullable()
         .unsigned()
         .index(`block_sets`)

    // Timestamps
    table.timestamps()
  }

  static foreignKeys(table) {
    table.foreign(`sets`)
         .references(`block`)
         .inTable(`blockSets`)
         .onDelete(`CASCADE`)
         .onUpdate(`NO ACTION`)
  }

  // Bookshelf Relation Definitions
  get tableName() { return `block` }

  get hasTimestamps() { return true }

  set() {
    return this.belongsTo(Set, `block`)
  }

  sets() {
    return this.hasMany(Set)
               .through(BlockSets)
  }
}
