import { GraphQLID, GraphQLNonNull, GraphQLInt, GraphQLString, GraphQLBoolean, GraphQLList, GraphQLObjectType, GraphQLInputObjectType } from 'graphql'
import Models from '../models'
import * as Name from './name'
import * as Layout from './layout'
import * as Color from './color'
import * as ColorIdentity from './colorIdentity'
import * as Supertype from './supertype'
import * as Type from './type'
import * as Subtype from './subtype'
import * as Rarity from './rarity'
import * as Set from './set'
import * as Category from './category'
import * as AbilityType from './abilityType'
import * as Keyword from './keyword'
import * as Legality from './legality'
import * as Ruling from './ruling'
import * as Artist from './artist'

export const Input = new GraphQLInputObjectType({
  name: `CardInput`,
  description: `Required fields for a new Card object`,
  fields: () => ({
    multiverseid:  { type: new GraphQLNonNull(GraphQLString) },
    names:         { type: new GraphQLNonNull(new GraphQLList(GraphQLID)) },
    sides:         { type: new GraphQLList(GraphQLID) },
    variations:    { type: new GraphQLList(GraphQLID) },
    border:        { type: new GraphQLNonNull(GraphQLString) },
    layout:        { type: new GraphQLNonNull(GraphQLID) },
    imageUrl:      { type: new GraphQLNonNull(GraphQLString) },
    watermark:     { type: GraphQLString },
    manaCost:      { type: GraphQLString },
    cmc:           { type: GraphQLInt },
    colors:        { type: new GraphQLNonNull(new GraphQLList(GraphQLID)) },
    colorIdentity: { type: new GraphQLNonNull(GraphQLID) },
    typeLine:      { type: GraphQLString },
    originalType:  { type: GraphQLString },
    supertypes:    { type: new GraphQLList(GraphQLID) },
    types:         { type: new GraphQLNonNull(new GraphQLList(GraphQLID)) },
    subtypes:      { type: new GraphQLList(GraphQLID) },
    rarity:        { type: GraphQLID },
    set:           { type: GraphQLID },
    text:          { type: GraphQLString },
    originalText:  { type: GraphQLString },
    categories:    { type: new GraphQLList(GraphQLID) },
    abilityTypes:  { type: new GraphQLList(GraphQLID) },
    keywords:      { type: new GraphQLList(GraphQLID) },
    flavor:        { type: GraphQLString },
    hand:          { type: GraphQLString },
    life:          { type: GraphQLString },
    power:         { type: GraphQLString },
    toughness:     { type: GraphQLString },
    loyalty:       { type: GraphQLInt },
    legalities:    { type: new GraphQLList(GraphQLID) },
    rulings:       { type: new GraphQLList(GraphQLID) },
    artist:        { type: new GraphQLNonNull(GraphQLID) },
    number:        { type: GraphQLString },
    releaseDate:   { type: GraphQLString },
    printings:     { type: new GraphQLList(GraphQLID) },
    timeshifted:   { type: GraphQLBoolean },
    starter:       { type: GraphQLBoolean },
    reserved:      { type: GraphQLBoolean },
    source:        { type: GraphQLString }
  })
})

export const Definition = new GraphQLObjectType({
  name: `Card`,
  description: `A Card object`,
  fields: () => ({
    id: {
      type: GraphQLID,
      description: `A unique id for this card.`,
      resolve: (root, { id }) => Models.Card
        .forge({ id })
        .then(model => model.toJSON().id)
    },
    multiverseid: {
      type: GraphQLString,
      description: `The multiverseid of the card on Wizard’s Gatherer web page. Cards from sets that do not exist on Gatherer will NOT have a multiverseid. Sets not on Gatherer are: ATH, ITP, DKM, RQS, DPA and all sets with a 4 letter code that starts with a lowercase 'p’.`,
      resolve: (root, { id }) => Models.Card
        .forge({ id })
        .then(model => model.toJSON().multiverseid)
    },
    names: {
      type: new GraphQLList(Name.Definition),
      description: `The card names. This includes a list of foreign names indexed by a language code. Example: enUS`,
      resolve: (root, { id }) => Models.Card
        .forge({ id })
        .fetch({ withRelated: [`names`] })
        .then(model => model.toJSON().names)
    },
    sides: {
      type: new GraphQLList(Definition),
      description: `Only used for split, flip and dual cards. Will contain a lit of cards representing each side of this card, front or back.`,
      resolve: (root, { id }) => Models.Card
        .forge({ id })
        .fetch({ withRelated: [`sides`] })
        .then(model => model.toJSON().sides)
    },
    variations: {
      type: new GraphQLList(Definition),
      description: `If a card has alternate art (for example, 4 different Forests, or the 2 Brothers Yamazaki) then each other variation’s card will be listed here, NOT including the current card.`,
      resolve: (root, { id }) => Models.Card
        .forge({ id })
        .fetch({ withRelated: [`variations`] })
        .then(model => model.toJSON().variations)
    },
    border: {
      type: GraphQLString,
      description: `If the border for this specific card is DIFFERENT than the border specified in the top level set JSON, then it will be specified here. (Example: Unglued has silver borders, except for the lands which are black bordered)`
    },
    layout: {
      type: Layout.Definition,
      description: `The card layout.`,
      resolve: (root, { id }) => Models.Card
        .forge({ id })
        .fetch({ withRelated: [`layout`] })
        .then(model => model.toJSON().layout)
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
      type: new GraphQLList(Color.Definition),
      description: `The card colors.`,
      resolve: (root, { id }) => Models.Card
        .forge({ id })
        .fetch({ withRelated: [`colors`] })
        .then(model => model.toJSON().colors)
    },
    colorIdentity: {
      type: ColorIdentity.Definition,
      description: `The card colors by color code. [“Red”, “Blue”] becomes [“R”, “U”]`,
      resolve: (root, { id }) => Models.Card
        .forge({ id })
        .fetch({ withRelated: [`colorIdentity`] })
        .then(model => model.toJSON().colorIdentity)
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
      type: new GraphQLList(Supertype.Definition),
      description: `The supertypes of the card. These appear to the far left of the card type.`,
      resolve: (root, { id }) => Models.Card
        .forge({ id })
        .fetch({ withRelated: [`supertypes`] })
        .then(model => model.toJSON().supertypes)
    },
    types: {
      type: new GraphQLList(Type.Definition),
      description: `The types of the card. These appear to the left of the dash in a card type.`,
      resolve: (root, { id }) => Models.Card
        .forge({ id })
        .fetch({ withRelated: [`types`] })
        .then(model => model.toJSON().types)
    },
    subtypes: {
      type: new GraphQLList(Subtype.Definition),
      description: `The subtypes of the card. These appear to the right of the dash in a card type. Usually each word is its own subtype.`,
      resolve: (root, { id }) => Models.Card
        .forge({ id })
        .fetch({ withRelated: [`subtypes`] })
        .then(model => model.toJSON().subtypes)
    },
    rarity: {
      type: Rarity.Definition,
      description: `The rarity of the card.`,
      resolve: (root, { id }) => Models.Card
        .forge({ id })
        .fetch({ withRelated: [`rarity`] })
        .then(model => model.toJSON().rarity)
    },
    set: {
      type: Set.Definition,
      description: `The set the card belongs to (set code).`,
      resolve: (root, { id }) => Models.Card
        .forge({ id })
        .fetch({ withRelated: [`set`] })
        .then(model => model.toJSON().set)
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
      type: new GraphQLList(Category.Definition),
      description: `A list of categories describind this card. Examples: Acceleration, Removal`,
      resolve: (root, { id }) => Models.Card
        .forge({ id })
        .fetch({ withRelated: [`categories`] })
        .then(model => model.toJSON().categories)
    },
    abilityTypes: {
      type: new GraphQLList(AbilityType.Definition),
      description: `A list of Ability Types this card has. Examples: Activated, Triggered`,
      resolve: (root, { id }) => Models.Card
        .forge({ id })
        .fetch({ withRelated: [`abilityTypes`] })
        .then(model => model.toJSON().abilityTypes)
    },
    keywords: {
      type: new GraphQLList(Keyword.Definition),
      description: `A list of keyword abilities this card has. Examples: Haste, Trample`,
      resolve: (root, { id }) => Models.Card
        .forge({ id })
        .fetch({ withRelated: [`keywords`] })
        .then(model => model.toJSON().keywords)
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
      type: new GraphQLList(Legality.Definition),
      description: `The legality of the card for a given format, such as Legal, Banned or Restricted.`,
      resolve: (root, { id }) => Models.Card
        .forge({ id })
        .fetch({ withRelated: [`legalities`] })
        .then(model => model.toJSON().legalities)
    },
    rulings: {
      type: new GraphQLList(Ruling.Definition),
      description: `The rulings for the card. An array of objects, each object having 'date’ and 'text’ keys.`,
      resolve: (root, { id }) => Models.Card
        .forge({ id })
        .fetch({ withRelated: [`rulings`] })
        .then(model => model.toJSON().rulings)
    },
    artist: {
      type: Artist.Definition,
      description: `The artist of the card. This may not match what is on the card as MTGJSON corrects many card misprints.`,
      resolve: (root, { id }) => Models.Card
        .forge({ id })
        .fetch({ withRelated: [`artist`] })
        .then(model => model.toJSON().artist)
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
      type: new GraphQLList(Set.Definition),
      description: `The sets that this card was printed in, expressed as an array of set codes.`,
      resolve: (root, { id }) => Models.Card
        .forge({ id })
        .fetch({ withRelated: [`printings`] })
        .then(model => model.toJSON().printings)
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
  getCard: {
    type: new GraphQLList(Definition),
    description: `Returns a Card with the given ID.`,
    args: {
      id: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLID))) }
    },
    resolve: (root, { id }) => Models.Card
      .where(`id`, `IN`, id)
      .fetchAll()
      .then(collection => collection.toJSON())
  },
  listCards: {
    type: new GraphQLList(Definition),
    description: `Lists all Cards.`,
    resolve: (root, { id }) => Models.Card
      .findAll()
      .then(collection => collection.toJSON())
  }
}

export const Mutations = {
  createCard: {
    type: Definition,
    description: `Creates a new Card`,
    args: { input: { type: Input } },
    resolve: (root, { input }) => Models.Card
      .findOrCreate(input)
      .then((model) => model.toJSON())
  },
  updateCard: {
    type: Definition,
    description: `Updates an existing Card, creates it if it does not already exist`,
    args: { input: { type: Input } },
    resolve: (root, { input }) => Models.Card
      .upsert(input, input)
      .then(model => model.toJSON())
  },
  deleteCard: {
    type: Definition,
    description: `Deletes a Card by id`,
    args: { id: { type: GraphQLID } },
    resolve: (root, { id }) => Models.Card
      .destroy({ id })
      .then(model => model.toJSON())
  }
}
