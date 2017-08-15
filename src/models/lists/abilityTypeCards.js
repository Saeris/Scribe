import db from '../../config/bookshelf.config'
import { bookshelfOptions } from '../../utilities'
import { Card, AbilityType } from '../tables'

@bookshelfOptions({ gid: false })
export default class AbilityTypeCards extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.string(`abilitytype`)
      .comment(`The abilityType associated with this card.`)
      .notNullable()

    table.string(`card`)
      .comment(`The card associated with this abilityType.`)
      .notNullable()

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`abilitytype`, `card`])
  }

  abilityType = () => this.belongsTo(AbilityType)

  card = () => this.hasMany(Card)
}
