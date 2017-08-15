import db from '../../config/bookshelf.config'
import { bookshelfOptions } from '../../utilities'
import { Set } from './'
import { BlockSets } from '../lists'

@bookshelfOptions
export default class Block extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.string(`id`)
      .notNullable()
      .primary()
      .unique()

    table.string(`name`)
      .comment(`The name of the block.`)
      .notNullable()
      .unique()

    // Timestamps
    table.timestamps()
  }

  sets = () => this.hasMany(Set, `id`).through(BlockSets, `id`, `block`, `set`)
}
