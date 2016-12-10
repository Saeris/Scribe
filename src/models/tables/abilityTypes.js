import db from '../../config/bookshelf.config'

import Card from './card'
import AbilityType from './abilityType'

export default class abilityTypes extends db.Model {
  get tableName() {
   return 'abilitytypes'
  }

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

  static foreignKeys(table) {
    table.foreign(`abilitytype`)
         .references(`id`)
         .inTable(`abilitytype`)
         .onDelete(`NO ACTION`)
         .onUpdate(`NO ACTION`)
  }

  abilityType() {
    return this.belongsTo(AbilityType)
  }

  card() {
    return this.hasMany(Card)
  }
}

export const AbilityTypes = new abilityTypes()
