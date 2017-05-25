import db from '../../config/bookshelf.config'
import { Card } from './'
import { AbilityTypes, AbilityTypeCards } from '../lists'

export default class AbilityType extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigIncrements(`id`)
      .notNullable()
      .unsigned()
      .primary()
      .unique()

    table.string(`name`)
      .comment(`The name of the ability type.`)
      .notNullable()
      .unique()

    table.text(`description`)
      .comment(`Description of the ability type.`)

    // Timestamps
    table.timestamps()
  }

  // Bookshelf Relation Definitions
  get tableName() { return `abilitytype` }

  get hasTimestamps() { return true }

  abilityTypes = () => this.belongsTo(AbilityTypes)

  cards = () => this.hasMany(Card, `card`).through(AbilityTypeCards)
}
