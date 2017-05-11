import db from '../../config/bookshelf.config'
import { Card, AbilityType } from '../tables'

export default class AbilityTypeCards extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigInteger(`abilitytype`)
         .comment(`The abilityType associated with this card.`)
         .notNullable()
         .unsigned()
         .index(`abilitytypecards_abilitytype`)

    table.bigInteger(`card`)
         .comment(`The card associated with this abilityType.`)
         .notNullable()
         .unsigned()
         .index(`abilitytypecards_card`)

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`abilitytype`, `card`])
  }

  // Bookshelf Relation Definitions
  get tableName() { return `abilitytypecards` }

  get hasTimestamps() { return true }

  abilityType() {
    return this.belongsTo(AbilityType)
  }

  card() {
    return this.hasMany(Card)
  }
}
