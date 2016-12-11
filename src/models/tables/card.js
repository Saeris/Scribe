import { GraphQLID, GraphQLNonNull, GraphQLInt, GraphQLString, GraphQLFloat, GraphQLBoolean, GraphQLList, GraphQLObjectType } from 'graphql'
import { inject } from 'aurelia-dependency-injection'
import db from '../../config/bookshelf.config'
import Name from './name'
import Layout from './layout'
import Sides from '../lists/sides'
import Variations from '../lists/variations'
import Color from './color'
import ColorIdentity from './colorIdentity'
import Supertype from './supertype'
import Type from './type'
import Subtype from './subtype'
import Rarity from './rarity'
import Set from './set'
import Category from './category'
import AbilityType from './abilityType'
import Keyword from './keyword'
import Legality from './legality'
import Ruling from './ruling'
import Artist from './artist'
import Printings from '../lists/printings'

@inject(Name, Layout, Color, ColorIdentity, Supertype, Type, Subtype, Rarity, Set, Category, AbilityType, Keyword, Legality, Ruling, Artist)
export default class Card extends db.Model {
  constructor(name, layout, color, colorIdentity, supertype, type, subtype, rarity, set, category, abilityType, keyword, legality, ruling, artist) {
    super()
    this.Name = name
    this.Layout = layout
    this.Color = color
    this.ColorIdentity = colorIdentity
    this.Supertype = supertype
    this.Type = type
    this.Subtype = subtype
    this.Rarity = rarity
    this.Set = set
    this.Category = category
    this.AbilityType = abilityType
    this.Keyword = keyword
    this.Legality = legality
    this.Ruling = ruling
    this.Artist = artist
  }

  Definition = new GraphQLObjectType({
    name: 'Card',
    description: 'A Card object',
    fields: () => ({
      id: {
        type: GraphQLID,
        description: `A unique id for this card.`,
        resolve: (root, {card}) => {
          return this
            .forge({id: card.id})
            .then(card => card.toJSON().id)
        }
      },
      multiverseid: {
        type: GraphQLString,
        description: `The multiverseid of the card on Wizard’s Gatherer web page. Cards from sets that do not exist on Gatherer will NOT have a multiverseid. Sets not on Gatherer are: ATH, ITP, DKM, RQS, DPA and all sets with a 4 letter code that starts with a lowercase 'p’.`,
        resolve: (root, {card}) => {
          return this
            .forge({id: card.id})
            .then(card => card.toJSON().multiverseid)
        }
      },
      names: {
        type: new GraphQLList(this.Name.Definition),
        description: `The card names. This includes a list of foreign names indexed by a language code. Example: enUS`,
        resolve: (root, {card}) => {
          return this
            .forge({id: card.id})
            .fetch({withRelated: ['names']})
            .then(card => card.toJSON().names)
        }
      },
      sides: {
        type: new GraphQLList(this.Definition),
        description: `Only used for split, flip and dual cards. Will contain a lit of cards representing each side of this card, front or back.`,
        resolve: (root, {card}) => {
          return this
            .forge({id: card.id})
            .fetch({withRelated: ['sides']})
            .then(card => card.toJSON().sides)
        }
      },
      variations: {
        type: new GraphQLList(this.Definition),
        description: `If a card has alternate art (for example, 4 different Forests, or the 2 Brothers Yamazaki) then each other variation’s card will be listed here, NOT including the current card.`,
        resolve: (card) => {
          return this
            .forge({id: card.id})
            .fetch({withRelated: ['variations']})
            .then(card => card.toJSON().variations)
        }
      },
      border: {
        type: GraphQLString,
        description: `If the border for this specific card is DIFFERENT than the border specified in the top level set JSON, then it will be specified here. (Example: Unglued has silver borders, except for the lands which are black bordered)`
      },
      layout: {
        type: this.Layout.Definition,
        description: `The card layout.`,
        resolve: (card) => {
          return this
            .forge({id: card.id})
            .fetch({withRelated: ['layout']})
            .then(card => card.toJSON().layout)
        }
      },
      imageUrl: {
        type: GraphQLString,
        description: `The image url for a card. Only exists if the card has a multiverse id.`
      },
      watermark: {
        type: GraphQLString,
        description: `The watermark on the card. Note: Split cards don’t currently have this field set, despite having a watermark on each side of the split card.`
      },
      manaCost: {
        type: GraphQLString,
        description: `The mana cost of this card. Consists of one or more mana symbols. (use cmc and colors to query)`
      },
      cmc: {
        type: GraphQLInt,
        description: `Converted mana cost.`
      },
      colors: {
        type: new GraphQLList(this.Color.Definition),
        description: `The card colors.`,
        resolve: (card) => {
          return this
            .forge({id: card.id})
            .fetch({withRelated: ['colors']})
            .then(card => card.toJSON().colors)
        }
      },
      colorIdentity: {
        type: this.ColorIdentity.Definition,
        description: `The card colors by color code. [“Red”, “Blue”] becomes [“R”, “U”]`,
        resolve: (card) => {
          return this
            .forge({id: card.id})
            .fetch({withRelated: ['colorIdentity']})
            .then(card => card.toJSON().colorIdentity)
        }
      },
      typeLine: {
        type: GraphQLString,
        description: `The card type. This is the type you would see on the card if printed today. Note: The dash is a UTF8 'long dash’ as per the MTG rules.`
      },
      originalType: {
        type: GraphQLString,
        description: `The original type on the card at the time it was printed. This field is not available for promo cards.`
      },
      supertypes: {
        type: new GraphQLList(this.Supertype.Definition),
        description: `The supertypes of the card. These appear to the far left of the card type.`,
        resolve: (card) => {
          return this
            .forge({id: card.id})
            .fetch({withRelated: ['supertypes']})
            .then(card => card.toJSON().supertypes)
        }
      },
      types: {
        type: new GraphQLList(this.Type.Definition),
        description: `The types of the card. These appear to the left of the dash in a card type.`,
        resolve: (card) => {
          return this
            .forge({id: card.id})
            .fetch({withRelated: ['types']})
            .then(card => card.toJSON().types)
        }
      },
      subtypes: {
        type: new GraphQLList(this.Subtype.Definition),
        description: `The subtypes of the card. These appear to the right of the dash in a card type. Usually each word is its own subtype.`,
        resolve: (card) => {
          return this
            .forge({id: card.id})
            .fetch({withRelated: ['subtypes']})
            .then(card => card.toJSON().subtypes)
        }
      },
      rarity: {
        type: this.Rarity.Definition,
        description: `The rarity of the card.`,
        resolve: (card) => {
          return this
            .forge({id: card.id})
            .fetch({withRelated: ['rarity']})
            .then(card => card.toJSON().rarity)
        }
      },
      set: {
        type: this.Set.Definition,
        description: `The set the card belongs to (set code).`,
        resolve: (card) => {
          return this
            .forge({id: card.id})
            .fetch({withRelated: ['set']})
            .then(card => card.toJSON().set)
        }
      },
      text: {
        type: GraphQLString,
        description: `The oracle text of the card. May contain mana symbols and other symbols.`
      },
      originalText: {
        type: GraphQLString,
        description: `The original text on the card at the time it was printed. This field is not available for promo cards.`
      },
      categories: {
        type: new GraphQLList(this.Category.Definition),
        description: `A list of categories describind this card. Examples: Acceleration, Removal`,
        resolve: (card) => {
          return this
            .forge({id: card.id})
            .fetch({withRelated: ['categories']})
            .then(card => card.toJSON().categories)
        }
      },
      abilityTypes: {
        type: new GraphQLList(this.AbilityType.Definition),
        description: `A list of Ability Types this card has. Examples: Activated, Triggered`,
        resolve: (card) => {
          return this
            .forge({id: card.id})
            .fetch({withRelated: ['abilityTypes']})
            .then(card => card.toJSON().abilityTypes)
        }
      },
      keywords: {
        type: new GraphQLList(this.Keyword.Definition),
        description: `A list of keyword abilities this card has. Examples: Haste, Trample`,
        resolve: (card) => {
          return this
            .forge({id: card.id})
            .fetch({withRelated: ['keywords']})
            .then(card => card.toJSON().keywords)
        }
      },
      flavor: {
        type: GraphQLString,
        description: `The flavor text of the card.`
      },
      hand: {
        type: GraphQLString,
        description: `Maximum hand size modifier. Only exists for Vanguard cards.`
      },
      life: {
        type: GraphQLString,
        description: `Starting life total modifier. Only exists for Vanguard cards.`
      },
      power: {
        type: GraphQLString,
        description: `The power of the card. This is only present for creatures. This is a string, not an integer, because some cards have powers like: “1+*”`
      },
      toughness: {
        type: GraphQLString,
        description: `The toughness of the card. This is only present for creatures. This is a string, not an integer, because some cards have toughness like: “1+*”`
      },
      loyalty: {
        type: GraphQLInt,
        description: `The loyalty of the card. This is only present for planeswalkers.`
      },
      legalities: {
        type: new GraphQLList(this.Legality.Definition),
        description: `The legality of the card for a given format, such as Legal, Banned or Restricted.`,
        resolve: (card) => {
          return this
            .forge({id: card.id})
            .fetch({withRelated: ['legalities']})
            .then(card => card.toJSON().legalities)
        }
      },
      rulings: {
        type: new GraphQLList(this.Ruling.Definition),
        description: `The rulings for the card. An array of objects, each object having 'date’ and 'text’ keys.`,
        resolve: (card) => {
          return this
            .forge({id: card.id})
            .fetch({withRelated: ['rulings']})
            .then(card => card.toJSON().rulings)
        }
      },
      artist: {
        type: this.Artist.Definition,
        description: `The artist of the card. This may not match what is on the card as MTGJSON corrects many card misprints.`,
        resolve: (card) => {
          return this
            .forge({id: card.id})
            .fetch({withRelated: ['artist']})
            .then(card => card.toJSON().artist)
        }
      },
      number: {
        type: GraphQLString,
        description: `The card number. This is printed at the bottom-center of the card in small text. This is a string, not an integer, because some cards have letters in their numbers.`
      },
      releaseDate: {
        type: GraphQLString,
        description: `The date this card was released. This is only set for promo cards. The date may not be accurate to an exact day and month, thus only a partial date may be set (YYYY-MM-DD or YYYY-MM or YYYY). Some promo cards do not have a known release date.`
      },
      printings: {
        type: new GraphQLList(this.Set.Definition),
        description: `The sets that this card was printed in, expressed as an array of set codes.`,
        resolve: (card) => {
          return this
            .forge({id: card.id})
            .fetch({withRelated: ['printings']})
            .then(card => card.toJSON().printings)
        }
      },
      timeshifted: {
        type: GraphQLBoolean,
        description: `If this card was a timeshifted card in the set.`
      },
      starter: {
        type: GraphQLBoolean,
        description: `Set to true if this card was only released as part of a core box set. These are technically part of the core sets and are tournament legal despite not being available in boosters.`
      },
      reserved: {
        type: GraphQLBoolean,
        description: `Set to true if this card is reserved by Wizards Official Reprint Policy`
      },
      source: {
        type: GraphQLString,
        description: `For promo cards, this is where this card was originally obtained. For box sets that are theme decks, this is which theme deck the card is from.`
      }
    })
  })

  Queries = {
    card: {
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
    cards: {
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

    table.string(`multiverseid`)
         .comment(`The multiverseid of the card on Wizard’s Gatherer web page. Cards from sets that do not exist on Gatherer will NOT have a multiverseid.`)
         .notNullable()

    table.bigInteger(`names`)
         .comment(`The card names. This includes a list of foreign names indexed by a language code. Example: enUS`)
         .notNullable()
         .unsigned()
         .index(`card_names`)

    table.bigInteger(`sides`)
         .comment(`Only used for split, flip and dual cards. Will contain a lit of cards representing each side of this card, front or back.`)
         .unsigned()
         .index(`card_sides`)

    table.bigInteger(`variations`)
         .comment(`If a card has alternate art (for example, 4 different Forests, or the 2 Brothers Yamazaki) then each other variation’s card will be listed here, NOT including the current card.`)
         .unsigned()
         .index(`card_variations`)

    table.string(`border`)
         .comment(`If the border for this specific card is DIFFERENT than the border specified in the top level set JSON, then it will be specified here. (Example: Unglued has silver borders, except for the lands which are black bordered)`)

    table.bigInteger(`layout`)
         .comment(`The card layout.`)
         .notNullable()
         .unsigned()
         .index(`card_layout`)

    table.string(`image`)
         .comment(`The image url for a card. Only exists if the card has a multiverse id.`)
         .notNullable()

    table.string(`manacost`)
         .comment(`The mana cost of this card. Consists of one or more mana symbols. (use cmc and colors to query)`)

    table.integer(`cmc`)
         .comment(`Converted mana cost.`)
         .notNullable()

    table.bigInteger(`coloridentity`)
         .comment(`The card colors by color code. [“Red”, “Blue”] becomes [“R”, “U”]`)
         .notNullable()
         .unsigned()
         .index(`card_coloridentity`)

    table.string(`typeLine`)
         .comment(`The card type. This is the type you would see on the card if printed today. Note: The dash is a UTF8 long dash as per the MTG rules.`)
         .notNullable()

    table.string(`originaltype`)
         .comment(`The original type on the card at the time it was printed. This field is not available for promo cards.`)

    table.bigInteger(`supertypes`)
         .comment(`The supertypes of the card. These appear to the far left of the card type.`)
         .unsigned()
         .index(`card_supertypes`)

    table.bigInteger(`types`)
         .comment(`The types of the card. These appear to the left of the dash in a card type.`)
         .notNullable()
         .unsigned()
         .index(`card_types`)

    table.bigInteger(`subtypes`)
         .comment(`The subtypes of the card. These appear to the right of the dash in a card type. Usually each word is its own subtype.`)
         .unsigned()
         .index(`card_subtypes`)

    table.bigInteger(`rarity`)
         .comment(`The rarity of the card.`)
         .notNullable()
         .unsigned()
         .index(`card_rarity`)

    table.bigInteger(`set`)
         .comment(`The set the card belongs to.`)
         .notNullable()
         .unsigned()
         .index(`card_set`)

    table.text(`text`)
         .comment(`The text of the card.`)
         .notNullable()

    table.text(`originaltext`)
         .comment(`The original text on the card at the time it was printed. This field is not available for promo cards.`)

    table.bigInteger(`categories`)
         .comment(`A list of categories describind this card. Examples: Acceleration, Removal`)
         .unsigned()
         .index(`card_categories`)

    table.bigInteger(`abilitytypes`)
         .comment(`A list of Ability Types this card has. Examples: Activated, Triggered`)
         .unsigned()
         .index(`card_abilityTypes`)

    table.bigInteger(`keywords`)
         .comment(`A list of keyword abilities this card has. Examples: Haste, Trample`)
         .unsigned()
         .index(`card_keywords`)

    table.text(`flavor`)
         .comment(`The flavor text of the card.`)

    table.string(`hand`)
         .comment(`Maximum hand size modifier. Only exists for Vanguard cards.`)

    table.string(`life`)
         .comment(`Starting life total modifier. Only exists for Vanguard cards.`)

    table.string(`power`)
         .comment(`The power of the card. This is only present for creatures. This is a string, not an integer, because some cards have powers like: “1+*”`)

    table.string(`toughness`)
         .comment(`The toughness of the card. This is only present for creatures. This is a string, not an integer, because some cards have toughness like: “1+*”`)

    table.integer(`loyalty`)
         .comment(`The loyalty of the card. This is only present for planeswalkers.`)

    table.bigInteger(`legalities`)
         .comment(`The legality of the card for a given format, such as Legal, Banned or Restricted.`)
         .notNullable()
         .unsigned()
         .index(`card_legalities`)

    table.bigInteger(`rulings`)
         .comment(`The rulings for the card. An array of objects, each object having date and text keys.`)
         .unsigned()
         .index(`card_rulings`)

    table.bigInteger(`artist`)
         .comment(`The artist of the card. This may not match what is on the card as MTGJSON corrects many card misprints.`)
         .notNullable()
         .unsigned()
         .index(`card_artist`)

    table.string(`number`)
         .comment(`The card number. This is printed at the bottom-center of the card in small text. This is a string, not an integer, because some cards have letters in their numbers.`)
         .notNullable()

    table.date(`releasedate`)
         .comment(`The date this card was released. This is only set for promo cards. The date may not be accurate to an exact day and month, thus only a partial date may be set (YYYY-MM-DD or YYYY-MM or YYYY). Some promo cards do not have a known release date.`)

    table.bigInteger(`printings`)
         .comment(`The sets that this card was printed in, expressed as an array of set codes.`)
         .notNullable()
         .unsigned()
         .index(`card_printings`)

    table.boolean(`timeshifted`)
         .comment(`If this card was a timeshifted card in the set.`)

    table.boolean(`starter`)
         .comment(`Set to true if this card was only released as part of a core box set. These are technically part of the core sets and are tournament legal despite not being available in boosters.`)

    table.boolean(`reserved`)
         .comment(`Set to true if this card is reserved by Wizards Official Reprint Policy.`)

    table.string(`source`)
         .comment(`For promo cards, this is where this card was originally obtained. For box sets that are theme decks, this is which theme deck the card is from.`)

    // Timestamps
    table.timestamps()
  }

  static foreignKeys(table) {
    table.foreign(`names`)
         .references(`card`)
         .inTable(`names`)
         .onDelete(`CASCADE`)
         .onUpdate(`NO ACTION`)

    table.foreign(`sides`)
         .references(`card`)
         .inTable(`sides`)
         .onDelete(`CASCADE`)
         .onUpdate(`NO ACTION`)

    table.foreign(`variations`)
         .references(`card`)
         .inTable(`variations`)
         .onDelete(`CASCADE`)
         .onUpdate(`NO ACTION`)

    table.foreign(`layout`)
         .references(`id`)
         .inTable(`layout`)
         .onDelete(`NO ACTION`)
         .onUpdate(`NO ACTION`)

    table.foreign(`coloridentity`)
         .references(`id`)
         .inTable(`coloridentity`)
         .onDelete(`NO ACTION`)
         .onUpdate(`NO ACTION`)

    table.foreign(`supertypes`)
         .references(`card`)
         .inTable(`supertypes`)
         .onDelete(`CASCADE`)
         .onUpdate(`NO ACTION`)

    table.foreign(`types`)
         .references(`card`)
         .inTable(`types`)
         .onDelete(`CASCADE`)
         .onUpdate(`NO ACTION`)

    table.foreign(`subtypes`)
         .references(`card`)
         .inTable(`subtypes`)
         .onDelete(`CASCADE`)
         .onUpdate(`NO ACTION`)

    table.foreign(`rarity`)
         .references(`id`)
         .inTable(`rarity`)
         .onDelete(`NO ACTION`)
         .onUpdate(`NO ACTION`)

    table.foreign(`set`)
         .references(`id`)
         .inTable(`set`)
         .onDelete(`NO ACTION`)
         .onUpdate(`NO ACTION`)

    table.foreign(`categories`)
         .references(`card`)
         .inTable(`categories`)
         .onDelete(`CASCADE`)
         .onUpdate(`NO ACTION`)

    table.foreign(`abilityTypes`)
         .references(`card`)
         .inTable(`abilitytypes`)
         .onDelete(`CASCADE`)
         .onUpdate(`NO ACTION`)

    table.foreign(`keywords`)
         .references(`card`)
         .inTable(`keywords`)
         .onDelete(`CASCADE`)
         .onUpdate(`NO ACTION`)

    table.foreign(`legalities`)
         .references(`card`)
         .inTable(`legalities`)
         .onDelete(`CASCADE`)
         .onUpdate(`NO ACTION`)

    table.foreign(`rulings`)
         .references(`card`)
         .inTable(`rulings`)
         .onDelete(`CASCADE`)
         .onUpdate(`NO ACTION`)

    table.foreign(`artist`)
         .references(`id`)
         .inTable(`artist`)
         .onDelete(`NO ACTION`)
         .onUpdate(`NO ACTION`)

    table.foreign(`printings`)
         .references(`card`)
         .inTable(`printings`)
         .onDelete(`CASCADE`)
         .onUpdate(`NO ACTION`)
  }

  // Bookshelf Relation Definitions
  get tableName() { return 'card' }

  get hasTimestamps() { return true }

  names() {
    return this.hasMany(Name, "names")
  }

  sides() {
    return this.hasMany(Card, "sides")
  }

  variations() {
    return this.hasMany(Card, "variations")
  }

  colors() {
    return this.hasMany(Color, "colors")
  }

  supertypes() {
    return this.hasMany(Supertype, "supertypes")
  }

  types() {
    return this.hasMany(Type, "types")
  }

  subtypes() {
    return this.hasMany(Subtype, "subtypes")
  }

  categories() {
    return this.hasMany(Category, "categories")
  }

  abilityTypes() {
    return this.hasMany(AbilityType, "abilityTypes")
  }

  keywords() {
    return this.hasMany(Keyword, "keywords")
  }

  legalities() {
    return this.hasMany(Legality, "legalities")
  }

  rulings() {
    return this.hasMany(Ruling, "rulings")
  }

  artist() {
    return this.hasone(Artist, "artist")
  }

  printings() {
    return this.hasMany(Card, "printings")
  }
}
