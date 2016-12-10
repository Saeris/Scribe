import db from '../../config/bookshelf.config'

import Card from './card'
import AbilityTypes from './abilityTypes'
import AbilityTypeCards from './abilityTypeCards'

export default class abilityType extends db.Model {
  get tableName() {
   return 'abilitytype'
  }

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
         .index(`abilityType_cards`)

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

  abilityTypes() {
    return this.belongsTo(AbilityTypes)
  }

  cards() {
    return this.hasMany(Card, `card`)
               .through(AbilityTypeCards)
  }
}

export const AbilityType = new abilityType()
