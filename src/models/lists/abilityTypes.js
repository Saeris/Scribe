import db from '../../config/bookshelf.config'
import Card from '../tables/card'
import AbilityType from '../tables/abilityType'

export default class abilityTypes extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigInteger(`card`)
         .comment(`The card associated with this abilityType.`)
         .notNullable()
         .unsigned()
         .index(`card`)

    table.bigInteger(`abilitytype`)
         .comment(`The abilityType associated with this card.`)
         .notNullable()
         .unsigned()
         .index(`abilitytype`)

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`card`, `abilitytype`])
  }

  static foreignKeys(table) {
    table.foreign(`abilitytype`)
         .references(`id`)
         .inTable(`abilitytype`)
         .onDelete(`NO ACTION`)
         .onUpdate(`NO ACTION`)
  }

  // Bookshelf Relation Definitions
  get tableName() { return 'abilitytypes' }

  get hasTimestamps() { return true }

  abilityType() {
    return this.belongsTo(AbilityType)
  }

  card() {
    return this.hasMany(Card)
  }
}
