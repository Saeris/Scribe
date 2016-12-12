import { GraphQLID, GraphQLNonNull, GraphQLList, GraphQLString, GraphQLObjectType } from 'graphql'
import db from '../../config/bookshelf.config'
import Card from './card'
import AbilityTypes from '../lists/abilityTypes'
import AbilityTypeCards from '../lists/abilityTypeCards'

export default class AbilityType extends db.Model {

  Definition = new GraphQLObjectType({
    name: 'AbilityType',
    description: 'An Ability Type object',
    fields: () => ({
      id: {
        type: GraphQLID,
        description: `A unique id for this ability type.`
      },
      name: {
        type: GraphQLString,
        description: `The name of the ability type.`
      },
      description: {
        type: GraphQLString,
        description: `Description of the ability type.`
      },
      cards: {
        type: new GraphQLList((new Card()).Definition),
        description: `The cards associated with this abilityType.`
      }
    })
  })

  Queries = {
    abilitytype: {
      type: new GraphQLList(this.Definition),
      args: {
        id: {
          name: 'id',
          type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLID)))
        }
      },
      resolve: (root, {id}) => {
        return this
          .where('id', 'IN', id)
          .fetchAll()
          .then((collection) => {
            return collection.toJSON()
          })
      }
    },
    abilitytypes: {
      type: new GraphQLList(this.Definition),
      resolve: (root, {id}) => {
        return this
          .findAll()
          .then((collection) => {
            return collection.toJSON()
          })
      }
    }
  }

  Mutations = {

  }

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
  get tableName() { return 'abilitytype' }

  get hasTimestamps() { return true }

  abilityTypes() {
    return this.belongsTo(AbilityTypes)
  }

  cards() {
    return this.hasMany(Card, `card`)
               .through(AbilityTypeCards)
  }
}
