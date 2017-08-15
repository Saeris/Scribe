import db from '../../config/bookshelf.config'
import { bookshelfOptions } from '../../utilities'
import { Card } from './'
import { AbilityTypes, AbilityTypeCards } from '../lists'

@bookshelfOptions
export default class AbilityType extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.string(`id`)
      .notNullable()
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

  abilityTypes = () => this.belongsTo(AbilityTypes)

  cards = () => this.hasMany(Card, `card`).through(AbilityTypeCards)
}
