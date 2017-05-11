import db from '../../config/bookshelf.config'

export default class AbilityTypes extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigInteger(`card`)
         .comment(`The card associated with this abilityType.`)
         .notNullable()
         .unsigned()
         .index(`abilitytypes_card`)

    table.bigInteger(`abilitytype`)
         .comment(`The abilityType associated with this card.`)
         .notNullable()
         .unsigned()
         .index(`abilitytypes_abilitytype`)

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`card`, `abilitytype`])
  }

  // Bookshelf Relation Definitions
  get tableName() { return `abilitytypes` }

  get hasTimestamps() { return true }
}
