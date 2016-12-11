import db from '../../config/bookshelf.config'
import Card from '../tables/card'
import AbilityType from '../tables/abilityType'

export default class AbilityTypeCards extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigInteger(`abilitytype`)
         .comment(`The abilityType associated with this card.`)
         .notNullable()
         .unsigned()
         .index(`abilitytype`)

    table.bigInteger(`card`)
         .comment(`The card associated with this abilityType.`)
         .notNullable()
         .unsigned()
         .index(`card`)

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`abilitytype`, `card`])
  }

  static foreignKeys(table) {
    table.foreign(`card`)
         .references(`id`)
         .inTable(`card`)
         .onDelete(`NO ACTION`)
         .onUpdate(`NO ACTION`)
  }

  // Bookshelf Relation Definitions
  get tableName() { return 'abilitytypecards' }

  get hasTimestamps() { return true }

  abilityType() {
    return this.belongsTo(AbilityType)
  }

  card() {
    return this.hasMany(Card)
  }
}
