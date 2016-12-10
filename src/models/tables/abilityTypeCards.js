import db from '../../config/bookshelf.config'

import Card from './card'
import AbilityType from './abilityType'

export default class abilityTypeCards extends db.Model {
  get tableName() {
   return 'abilitytypecards'
  }

  static fields(table) {
    // Fields
    table.bigInteger(`abilitytype`)
         .comment(`The abilityType associated with this card.`)
         .notNullable()
         .unsigned()
         .index(`abilityTypeCards_abilitytype`)

    table.bigInteger(`card`)
         .comment(`The card associated with this abilityType.`)
         .notNullable()
         .unsigned()
         .index(`abilityTypeCards_card`)

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

  abilityType() {
    return this.belongsTo(AbilityType)
  }

  card() {
    return this.hasMany(Card)
  }
}

export const AbilityTypeCards = new abilityTypeCards()
