import db from '../../config/bookshelf.config'
import Card from './card'
import AbilityTypes from '../lists/abilityTypes'
import AbilityTypeCards from '../lists/abilityTypeCards'

export default class AbilityType extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigIncrements(`id`)
         .notNullable()
         .primary()

    table.string(`name`)
         .comment(`The name of the ability type.`)
         .notNullable()

    table.text(`description`)
         .comment(`Description of the ability type.`)

    table.bigInteger(`cards`)
         .comment(`The cards associated with this abilityType.`)
         .notNullable()
         .unsigned()
         .index(`abilitytype_cards`)

    // Timestamps
    table.timestamps()
  }

  static foreignKeys(table) {
    table.foreign(`cards`)
         .references(`abilitytype`)
         .inTable(`abilitytypecards`)
         .onDelete(`CASCADE`)
         .onUpdate(`NO ACTION`)
  }

  // Bookshelf Relation Definitions
  get tableName() { return `abilitytype` }

  get hasTimestamps() { return true }

  abilityTypes() {
    return this.belongsTo(AbilityTypes)
  }

  cards() {
    return this.hasMany(Card, `card`)
               .through(AbilityTypeCards)
  }
}
