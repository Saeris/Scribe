import { GraphQLID, GraphQLNonNull, GraphQLInt, GraphQLEnumType, GraphQLString, GraphQLBoolean, GraphQLList, GraphQLObjectType, GraphQLInputObjectType } from 'graphql'
import order from './utilities/order'
import Models from '../models'
import * as Name from './name'
import * as Image from './image'
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
    names:         { type: new GraphQLList(GraphQLID) },
    images:        { type: new GraphQLList(GraphQLID) },
    sides:         { type: new GraphQLList(GraphQLID) },
    variations:    { type: new GraphQLList(GraphQLID) },
    border:        { type: new GraphQLNonNull(GraphQLString) },
    layout:        { type: new GraphQLNonNull(GraphQLID) },
    watermark:     { type: GraphQLString },
    manaCost:      { type: GraphQLString },
    cmc:           { type: GraphQLInt },
    colors:        { type: new GraphQLList(GraphQLID) },
    colorIdentity: { type: new GraphQLNonNull(GraphQLID) },
    typeLine:      { type: GraphQLString },
    originalType:  { type: GraphQLString },
    supertypes:    { type: new GraphQLList(GraphQLID) },
    types:         { type: new GraphQLList(GraphQLID) },
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

const Filter = new GraphQLInputObjectType({
  name: `CardFilter`,
  description: `Queryable fields for Card.`,
  fields: () => ({
    name:          { type: new GraphQLList(GraphQLString) },
    sides:         { type: new GraphQLList(GraphQLID) },
    variations:    { type: new GraphQLList(GraphQLID) },
    border:        { type: new GraphQLList(GraphQLString) },
    layout:        { type: new GraphQLList(GraphQLID) },
    watermark:     { type: GraphQLString },
    manaCost:      { type: new GraphQLList(GraphQLString) },
    cmc:           { type: new GraphQLList(GraphQLInt) },
    colors:        { type: new GraphQLList(GraphQLID) },
    colorIdentity: { type: new GraphQLList(GraphQLID) },
    supertypes:    { type: new GraphQLList(GraphQLID) },
    types:         { type: new GraphQLList(GraphQLID) },
    subtypes:      { type: new GraphQLList(GraphQLID) },
    rarity:        { type: new GraphQLList(GraphQLID) },
    set:           { type: new GraphQLList(GraphQLID) },
    text:          { type: GraphQLString },
    categories:    { type: new GraphQLList(GraphQLID) },
    abilityTypes:  { type: new GraphQLList(GraphQLID) },
    keywords:      { type: new GraphQLList(GraphQLID) },
    flavor:        { type: GraphQLString },
    hand:          { type: new GraphQLList(GraphQLString) },
    life:          { type: new GraphQLList(GraphQLString) },
    power:         { type: new GraphQLList(GraphQLString) },
    toughness:     { type: new GraphQLList(GraphQLString) },
    loyalty:       { type: new GraphQLList(GraphQLInt) },
    legalities:    { type: new GraphQLList(GraphQLID) },
    rulings:       { type: new GraphQLList(GraphQLID) },
    artist:        { type: new GraphQLList(GraphQLID) },
    number:        { type: new GraphQLList(GraphQLString) },
    releaseDate:   { type: new GraphQLList(GraphQLString) },
    printings:     { type: new GraphQLList(GraphQLID) },
    timeshifted:   { type: GraphQLBoolean },
    starter:       { type: GraphQLBoolean },
    reserved:      { type: GraphQLBoolean }
  })
})

const Fields = new GraphQLEnumType({
  name: `CardFields`,
  description: `Field names for Card.`,
  values: {
    name:          { value: `name` },
    border:        { value: `border` },
    layout:        { value: `layout` },
    manaCost:      { value: `manaCost` },
    cmc:           { value: `cmc` },
    colors:        { value: `colors` },
    colorIdentity: { value: `colorIdentity` },
    supertypes:    { value: `supertypes` },
    types:         { value: `types` },
    subtypes:      { value: `subtypes` },
    rarity:        { value: `rarity` },
    set:           { value: `set` },
    text:          { value: `text` },
    hand:          { value: `hand` },
    life:          { value: `life` },
    power:         { value: `power` },
    toughness:     { value: `toughness` },
    loyalty:       { value: `loyalty` },
    artist:        { value: `artist` },
    number:        { value: `number` },
    releaseDate:   { value: `releaseDate` },
    timeshifted:   { value: `timeshifted` },
    starter:       { value: `starter` },
    reserved:      { value: `reserved` }
  }
})

export const Definition = new GraphQLObjectType({
  name: `Card`,
  description: `A Card object`,
  fields: () => ({
    id: {
      type: GraphQLID,
      description: `A unique id for this card.`
    },
    name: {
      type: GraphQLString,
      description: `The card's English name.`,
      resolve: (type) => Models.Card
        .findById(type.id, { withRelated: [`names`] })
        .then(model => model.toJSON().names.find(name => name.language === 1 ? true : false).name)
    },
    names: {
      type: new GraphQLList(Name.Definition),
      description: `The card names. This includes a list of foreign names indexed by a language code. Example: enUS`,
      resolve: (type) => Models.Card
        .findById(type.id, { withRelated: [`names`] })
        .then(model => model.toJSON().names)
    },
    images: {
      type: new GraphQLList(Image.Definition),
      description: `The card images. This includes a list of foreign images indexed by a language code. Example: enUS`,
      resolve: (type) => Models.Card
        .findById(type.id, { withRelated: [`images`] })
        .then(model => model.toJSON().images)
    },
    sides: {
      type: new GraphQLList(Definition),
      description: `Only used for split, flip and dual cards. Will contain a lit of cards representing each side of this card, front or back.`,
      resolve: (type) => Models.Card
        .findById(type.id, { withRelated: [`sides`] })
        .then(model => model.toJSON().sides)
    },
    variations: {
      type: new GraphQLList(Definition),
      description: `If a card has alternate art (for example, 4 different Forests, or the 2 Brothers Yamazaki) then each other variation’s card will be listed here, NOT including the current card.`,
      resolve: (type) => Models.Card
        .findById(type.id, { withRelated: [`variations`] })
        .then(model => model.toJSON().variations)
    },
    border: {
      type: GraphQLString,
      description: `If the border for this specific card is DIFFERENT than the border specified in the top level set JSON, then it will be specified here. (Example: Unglued has silver borders, except for the lands which are black bordered)`
    },
    layout: {
      type: Layout.Definition,
      description: `The card layout.`,
      resolve: (type) => Models.Card
        .findById(type.id, { withRelated: [`layout`] })
        .then(model => model.toJSON().layout)
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
      resolve: (type) => Models.Card
        .findById(type.id, { withRelated: [`colors`] })
        .then(model => model.toJSON().colors)
    },
    colorIdentity: {
      type: ColorIdentity.Definition,
      description: `The card colors by color code. [“Red”, “Blue”] becomes [“R”, “U”]`,
      resolve: (type) => Models.Card
        .findById(type.id, { withRelated: [`colorIdentity`] })
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
      resolve: (type) => Models.Card
        .findById(type.id, { withRelated: [`supertypes`] })
        .then(model => model.toJSON().supertypes)
    },
    types: {
      type: new GraphQLList(Type.Definition),
      description: `The types of the card. These appear to the left of the dash in a card type.`,
      resolve: (type) => Models.Card
        .findById(type.id, { withRelated: [`types`] })
        .then(model => model.toJSON().types)
    },
    subtypes: {
      type: new GraphQLList(Subtype.Definition),
      description: `The subtypes of the card. These appear to the right of the dash in a card type. Usually each word is its own subtype.`,
      resolve: (type) => Models.Card
        .findById(type.id, { withRelated: [`subtypes`] })
        .then(model => model.toJSON().subtypes)
    },
    rarity: {
      type: Rarity.Definition,
      description: `The rarity of the card.`,
      resolve: (type) => Models.Card
        .findById(type.id, { withRelated: [`rarity`] })
        .then(model => model.toJSON().rarity)
    },
    set: {
      type: Set.Definition,
      description: `The set the card belongs to (set code).`,
      resolve: (type) => Models.Card
        .findById(type.id, { withRelated: [`set`] })
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
      resolve: (type) => Models.Card
        .findById(type.id, { withRelated: [`categories`] })
        .then(model => model.toJSON().categories)
    },
    abilityTypes: {
      type: new GraphQLList(AbilityType.Definition),
      description: `A list of Ability Types this card has. Examples: Activated, Triggered`,
      resolve: (type) => Models.Card
        .findById(type.id, { withRelated: [`abilityTypes`] })
        .then(model => model.toJSON().abilityTypes)
    },
    keywords: {
      type: new GraphQLList(Keyword.Definition),
      description: `A list of keyword abilities this card has. Examples: Haste, Trample`,
      resolve: (type) => Models.Card
        .findById(type.id, { withRelated: [`keywords`] })
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
      resolve: (type) => Models.Card
        .findById(type.id, { withRelated: [`legalities`] })
        .then(model => model.toJSON().legalities)
    },
    rulings: {
      type: new GraphQLList(Ruling.Definition),
      description: `The rulings for the card. An array of objects, each object having 'date’ and 'text’ keys.`,
      resolve: (type) => Models.Card
        .findById(type.id, { withRelated: [`rulings`] })
        .then(model => model.toJSON().rulings)
    },
    artist: {
      type: Artist.Definition,
      description: `The artist of the card. This may not match what is on the card as MTGJSON corrects many card misprints.`,
      resolve: (type) => Models.Card
        .findById(type.id, { withRelated: [`artist`] })
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
      resolve: (type) => Models.Card
        .findById(type.id, { withRelated: [`printings`] })
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
  card: {
    type: new GraphQLList(Definition),
    description: `Returns a Card.`,
    args: {
      id: { type: new GraphQLList(GraphQLID) },
      filter: {
        type: Filter
      },
      limit: { type: GraphQLInt },
      offset: { type: GraphQLInt },
      orderBy: { type: order(`card`, Fields) }
    },
    resolve: (root, { id, filter, limit, offset, orderBy }) => Models.Card
      .query(qb => {
        if (!!id) qb.whereIn(`id`, id)
        if (!!filter) {
          for (let field in filter) {
            qb.whereIn(field, filter[field])
          }
        }
        if (!!!limit || limit > 100) limit = 100
        qb.limit(limit)
        if (!!offset) qb.offset(offset)
        if (!!orderBy) qb.orderBy(...Object.values(orderBy))
      })
      .fetchAll()
      .then(collection => collection.toJSON())
  }
}

export const Mutations = {
  createCard: {
    type: Definition,
    description: `Creates a new Card`,
    args: { input: { type: Input } },
    resolve: (root, { input }) => {
      let { names, images, sides, variations, colors, supertypes, types, subtypes, categories, abilityTypes, keywords, legalities, rulings, printings, ...fields } = input
      return Models.Card
        .findOrCreate(fields)
        .then(model => {
          let card = model.toJSON()

          if (!!names) for (let name of names) Models.Names.findOrCreate({ card: card.id, name })

          if (!!images) for (let image of images) Models.Images.findOrCreate({ card: card.id, image })

          if (!!colors) for (let color of colors) Models.CardColors.findOrCreate({ card: card.id, color })

          if (!!supertypes) for (let supertype of supertypes) Models.Supertypes.findOrCreate({ card: card.id, supertype })

          if (!!types) for (let type of types) Models.Types.findOrCreate({ card: card.id, type })

          if (!!subtypes) for (let subtype of subtypes) Models.Subtypes.findOrCreate({ card: card.id, subtype })

          return card
        })
    }
  },
  updateCard: {
    type: Definition,
    description: `Updates an existing Card, creates it if it does not already exist`,
    args: { input: { type: Input } },
    resolve: (root, { input }) => {
      let { names, images, sides, variations, colors, supertypes, types, subtypes, categories, abilityTypes, keywords, legalities, rulings, printings, ...fields } = input
      return Models.Card
        .upsert(fields, fields)
        .then(model => {
          let card = model.toJSON()

          if (!!names) for (let name of names) Models.Names.findOrCreate({ card: card.id, name })

          if (!!images) for (let image of images) Models.Images.findOrCreate({ card: card.id, image })

          if (!!colors) for (let color of colors) Models.CardColors.findOrCreate({ card: card.id, color })

          if (!!supertypes) for (let supertype of supertypes) Models.Supertypes.findOrCreate({ card: card.id, supertype })

          if (!!types) for (let type of types) Models.Types.findOrCreate({ card: card.id, type })

          if (!!subtypes) for (let subtype of subtypes) Models.Subtypes.findOrCreate({ card: card.id, subtype })

          return card
        })
    }
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
