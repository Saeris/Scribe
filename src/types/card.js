import { GraphQLID, GraphQLNonNull, GraphQLInt, GraphQLString, GraphQLFloat, GraphQLBoolean, GraphQLList, GraphQLObjectType } from 'graphql'
import Models from '../models'
import { Definition as name } from './name'
import { Definition as layout } from './layout'
import { Definition as color } from './color'
import { Definition as colorIdentity } from './colorIdentity'
import { Definition as supertype } from './supertype'
import { Definition as type } from './type'
import { Definition as subtype } from './subtype'
import { Definition as rarity } from './rarity'
import { Definition as set } from './set'
import { Definition as category } from './category'
import { Definition as abilityType } from './abilityType'
import { Definition as keyword } from './keyword'
import { Definition as legality } from './legality'
import { Definition as ruling } from './ruling'
import { Definition as artist } from './artist'

export const Definition = new GraphQLObjectType({
  name: 'Card',
  description: 'A Card object',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
      description: `A unique id for this card.`,
      resolve: (root, {card}) => {
        return Models.card.forge({id: card.id})
                          .then(card => card.toJSON().id)
      }
    },
    multiverseid: {
      type: GraphQLString,
      description: `The multiverseid of the card on Wizard’s Gatherer web page. Cards from sets that do not exist on Gatherer will NOT have a multiverseid. Sets not on Gatherer are: ATH, ITP, DKM, RQS, DPA and all sets with a 4 letter code that starts with a lowercase 'p’.`,
      resolve: (root, {card}) => {
        return Models.card.forge({id: card.id})
                          .then(card => card.toJSON().multiverseid)
      }
    },
    names: {
      type: new GraphQLList(name),
      description: `The card names. This includes a list of foreign names indexed by a language code. Example: enUS`,
      resolve: (root, {card}) => {
        return Models.card.forge({id: card.id})
                          .fetch({withRelated: ['names']})
                          .then(card => card.toJSON().names)
      }
    },
    sides: {
      type: new GraphQLList(Definition),
      description: `Only used for split, flip and dual cards. Will contain a lit of cards representing each side of this card, front or back.`,
      resolve: (root, {card}) => {
        return Models.card.forge({id: card.id})
                          .fetch({withRelated: ['sides']})
                          .then(card => card.toJSON().sides)
      }
    },
    variations: {
      type: new GraphQLList(Definition),
      description: `If a card has alternate art (for example, 4 different Forests, or the 2 Brothers Yamazaki) then each other variation’s card will be listed here, NOT including the current card.`,
      resolve: (card) => {
        return Models.card.forge({id: card.id})
                          .fetch({withRelated: ['variations']})
                          .then(card => card.toJSON().variations)
      }
    },
    border: {
      type: GraphQLString,
      description: `If the border for this specific card is DIFFERENT than the border specified in the top level set JSON, then it will be specified here. (Example: Unglued has silver borders, except for the lands which are black bordered)`
    },
    layout: {
      type: layout,
      description: `The card layout.`,
      resolve: (card) => {
        return Models.card.forge({id: card.id})
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
      type: new GraphQLList(color),
      description: `The card colors.`,
      resolve: (card) => {
        return Models.card.forge({id: card.id})
                          .fetch({withRelated: ['colors']})
                          .then(card => card.toJSON().colors)
      }
    },
    colorIdentity: {
      type: colorIdentity,
      description: `The card colors by color code. [“Red”, “Blue”] becomes [“R”, “U”]`,
      resolve: (card) => {
        return Models.card.forge({id: card.id})
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
      type: new GraphQLList(supertype),
      description: `The supertypes of the card. These appear to the far left of the card type.`,
      resolve: (card) => {
        return Models.card.forge({id: card.id})
                          .fetch({withRelated: ['supertypes']})
                          .then(card => card.toJSON().supertypes)
      }
    },
    types: {
      type: new GraphQLList(type),
      description: `The types of the card. These appear to the left of the dash in a card type.`,
      resolve: (card) => {
        return Models.card.forge({id: card.id})
                          .fetch({withRelated: ['types']})
                          .then(card => card.toJSON().types)
      }
    },
    subtypes: {
      type: new GraphQLList(subtype),
      description: `The subtypes of the card. These appear to the right of the dash in a card type. Usually each word is its own subtype.`,
      resolve: (card) => {
        return Models.card.forge({id: card.id})
                          .fetch({withRelated: ['subtypes']})
                          .then(card => card.toJSON().subtypes)
      }
    },
    rarity: {
      type: rarity,
      description: `The rarity of the card.`,
      resolve: (card) => {
        return Models.card.forge({id: card.id})
                          .fetch({withRelated: ['rarity']})
                          .then(card => card.toJSON().rarity)
      }
    },
    set: {
      type: set,
      description: `The set the card belongs to (set code).`,
      resolve: (card) => {
        return Models.card.forge({id: card.id})
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
      type: new GraphQLList(category),
      description: `A list of categories describind this card. Examples: Acceleration, Removal`,
      resolve: (card) => {
        return Models.card.forge({id: card.id})
                          .fetch({withRelated: ['categories']})
                          .then(card => card.toJSON().categories)
      }
    },
    abilityTypes: {
      type: new GraphQLList(abilityType),
      description: `A list of Ability Types this card has. Examples: Activated, Triggered`,
      resolve: (card) => {
        return Models.card.forge({id: card.id})
                          .fetch({withRelated: ['abilityTypes']})
                          .then(card => card.toJSON().abilityTypes)
      }
    },
    keywords: {
      type: new GraphQLList(keyword),
      description: `A list of keyword abilities this card has. Examples: Haste, Trample`,
      resolve: (card) => {
        return Models.card.forge({id: card.id})
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
      type: new GraphQLList(legality),
      description: `The legality of the card for a given format, such as Legal, Banned or Restricted.`,
      resolve: (card) => {
        return Models.card.forge({id: card.id})
                          .fetch({withRelated: ['legalities']})
                          .then(card => card.toJSON().legalities)
      }
    },
    rulings: {
      type: new GraphQLList(ruling),
      description: `The rulings for the card. An array of objects, each object having 'date’ and 'text’ keys.`,
      resolve: (card) => {
        return Models.card.forge({id: card.id})
                          .fetch({withRelated: ['rulings']})
                          .then(card => card.toJSON().rulings)
      }
    },
    artist: {
      type: artist,
      description: `The artist of the card. This may not match what is on the card as MTGJSON corrects many card misprints.`,
      resolve: (card) => {
        return Models.card.forge({id: card.id})
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
      type: new GraphQLList(set),
      description: `The sets that this card was printed in, expressed as an array of set codes.`,
      resolve: (card) => {
        return Models.card.forge({id: card.id})
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

export const Queries = {
  card: {
    type: new GraphQLList(Definition),
    args: {
      id: {
        name: 'id',
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLID)))
      }
    },
    resolve(root, {id}) {
      return Models.card
        .where('id', 'IN', id)
        .fetchAll()
        .then((collection) => {
          return collection.toJSON()
        })
    }
  },
  cards: {
    type: new GraphQLList(Definition),
    resolve(root, {id}) {
      return Models.card
        .findAll()
        .then((collection) => {
          return collection.toJSON()
        })
    }
  }
}

export const Mutations = {

}
