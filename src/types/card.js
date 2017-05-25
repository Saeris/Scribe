import { GraphQLID, GraphQLNonNull, GraphQLInt, GraphQLEnumType, GraphQLString, GraphQLList, GraphQLObjectType, GraphQLInputObjectType } from 'graphql'
import { destroy, load, loadRelated, order, read } from './utilities'
import { info, error } from 'winston'
import Models from '../models'
import { Name, Layout, Color, ColorIdentity, Category, AbilityType, Keyword, Legality, Ruling, Printing } from './'

export const Input = new GraphQLInputObjectType({
  name: `CardInput`,
  description: `Required fields for a new Card object`,
  fields: () => ({
    name:          { type: new GraphQLNonNull(GraphQLString) },
    names:         { type: new GraphQLList(GraphQLID) },
    border:        { type: GraphQLString },
    layout:        { type: new GraphQLNonNull(GraphQLID) },
    watermark:     { type: GraphQLString },
    manaCost:      { type: GraphQLString },
    cmc:           { type: GraphQLInt },
    colors:        { type: new GraphQLList(GraphQLID) },
    colorIdentity: { type: new GraphQLNonNull(GraphQLID) },
    typeLine:      { type: GraphQLString },
    supertypes:    { type: new GraphQLList(GraphQLID) },
    types:         { type: new GraphQLList(GraphQLID) },
    subtypes:      { type: new GraphQLList(GraphQLID) },
    rarity:        { type: GraphQLID },
    text:          { type: GraphQLString },
    categories:    { type: new GraphQLList(GraphQLID) },
    abilityTypes:  { type: new GraphQLList(GraphQLID) },
    keywords:      { type: new GraphQLList(GraphQLID) },
    hand:          { type: GraphQLString },
    life:          { type: GraphQLString },
    power:         { type: GraphQLString },
    toughness:     { type: GraphQLString },
    loyalty:       { type: GraphQLInt },
    legalities:    { type: new GraphQLList(GraphQLID) },
    rulings:       { type: new GraphQLList(GraphQLID) }
  })
})

const Filter = new GraphQLInputObjectType({
  name: `CardFilter`,
  description: `Queryable fields for Card.`,
  fields: () => ({
    name:          { type: new GraphQLList(GraphQLString) },
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
    text:          { type: GraphQLString },
    categories:    { type: new GraphQLList(GraphQLID) },
    abilityTypes:  { type: new GraphQLList(GraphQLID) },
    keywords:      { type: new GraphQLList(GraphQLID) },
    hand:          { type: new GraphQLList(GraphQLString) },
    life:          { type: new GraphQLList(GraphQLString) },
    power:         { type: new GraphQLList(GraphQLString) },
    toughness:     { type: new GraphQLList(GraphQLString) },
    loyalty:       { type: new GraphQLList(GraphQLInt) },
    legalities:    { type: new GraphQLList(GraphQLID) },
    rulings:       { type: new GraphQLList(GraphQLID) }
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
    text:          { value: `text` },
    hand:          { value: `hand` },
    life:          { value: `life` },
    power:         { value: `power` },
    toughness:     { value: `toughness` },
    loyalty:       { value: `loyalty` }
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
      description: `The card's English name.`
    },
    names: {
      type: new GraphQLList(Name.Definition),
      description: `The card names. This includes a list of foreign names indexed by a language code. Example: enUS`,
      resolve: type => loadRelated(type.id, Models.Card, `names`)
    },
    border: {
      type: GraphQLString,
      description: `If the border for this specific card is DIFFERENT than the border specified in the top level set JSON, then it will be specified here. (Example: Unglued has silver borders, except for the lands which are black bordered)`
    },
    layout: {
      type: Layout.Definition,
      description: `The card layout.`,
      resolve: type => load(type.layout, Models.Layout)
    },
    watermark: {
      type: GraphQLString,
      description: `The watermark on the card. Note: Split cards don’t currently have this field set, despite having a watermark on each side of the split card.`
    },
    manacost: {
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
      resolve: type => loadRelated(type.id, Models.Card, `colors`)
    },
    colorIdentity: {
      type: ColorIdentity.Definition,
      description: `The card colors by color code. [“Red”, “Blue”] becomes [“R”, “U”]`,
      resolve: type => load(type.colorIdentity, Models.ColorIdentity)
    },
    typeLine: {
      type: GraphQLString,
      description: `The card type. This is the type you would see on the card if printed today. Note: The dash is a UTF8 'long dash’ as per the MTG rules.`
    },
    supertypes: {
      type: new GraphQLList(GraphQLString),
      description: `The supertypes of the card. These appear to the far left of the card type.`,
      resolve: type => loadRelated(type.id, Models.Card, `supertypes`)
        .then(supertypes => supertypes.map(supertype => supertype.name))
    },
    types: {
      type: new GraphQLList(GraphQLString),
      description: `The types of the card. These appear to the left of the dash in a card type.`,
      resolve: type => loadRelated(type.id, Models.Card, `types`)
        .then(cardtypes => cardtypes.map(cardtype => cardtype.name))
    },
    subtypes: {
      type: new GraphQLList(GraphQLString),
      description: `The subtypes of the card. These appear to the right of the dash in a card type. Usually each word is its own subtype.`,
      resolve: type => loadRelated(type.id, Models.Card, `subtypes`)
        .then(subtypes => subtypes.map(subtype => subtype.name))
    },
    rarity: {
      type: GraphQLString,
      description: `The rarity of the card.`,
      resolve: type => load(type.rarity, Models.Rarity).then(rarity => rarity.name)
    },
    text: {
      type: GraphQLString,
      description: `The oracle text of the card. May contain mana symbols and other symbols.`
    },
    categories: {
      type: new GraphQLList(Category.Definition),
      description: `A list of categories describind this card. Examples: Acceleration, Removal`,
      resolve: type => loadRelated(type.id, Models.Card, `categories`)
    },
    abilityTypes: {
      type: new GraphQLList(AbilityType.Definition),
      description: `A list of Ability Types this card has. Examples: Activated, Triggered`,
      resolve: type => loadRelated(type.id, Models.Card, `abilityTypes`)
    },
    keywords: {
      type: new GraphQLList(Keyword.Definition),
      description: `A list of keyword abilities this card has. Examples: Haste, Trample`,
      resolve: type => loadRelated(type.id, Models.Card, `keywords`)
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
      resolve: type => loadRelated(type.id, Models.Card, `legalities`)
    },
    rulings: {
      type: new GraphQLList(Ruling.Definition),
      description: `The rulings for the card. An array of objects, each object having 'date’ and 'text’ keys.`,
      resolve: type => loadRelated(type.id, Models.Card, `rulings`)
    },
    printings: {
      type: new GraphQLList(Printing.Definition),
      description: `The sets that this card was printed in, expressed as an array of set codes.`,
      resolve: type => loadRelated(type.id, Models.Card, `printings`)
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
    resolve: (parent, args, context) => read(parent, args, context, Definition.name)
  }
}

export const Mutations = {
  createCard: {
    type: Definition,
    description: `Creates a new Card`,
    args: { input: { type: Input } },
    resolve: (parent, { input }, context) => {
      const { names, colors, supertypes, types, subtypes, categories, abilityTypes, keywords, legalities, rulings, ...fields } = input //eslint-disable-line
      return Models.Card
        .findOrCreate(fields)
        .then(model => {
          let card = model.toJSON()

          if (!!names) for (let name of names) Models.Names.findOrCreate({ card: card.id, name })

          if (!!colors) for (let color of colors) Models.CardColors.findOrCreate({ card: card.id, color })

          if (!!supertypes) for (let supertype of supertypes) Models.Supertypes.findOrCreate({ card: card.id, supertype })

          if (!!types) for (let type of types) Models.Types.findOrCreate({ card: card.id, type })

          if (!!subtypes) for (let subtype of subtypes) Models.Subtypes.findOrCreate({ card: card.id, subtype })

          return card
        })
        .catch(err => error(`Failed to run Mutation: create${Definition.name}`, err))
        .finally(info(`Resolved Mutation: create${Definition.name}`, { parent, input, context}))
    }
  },
  updateCard: {
    type: Definition,
    description: `Updates an existing Card, creates it if it does not already exist`,
    args: { input: { type: Input } },
    resolve: (parent, { input }, context) => {
      const { names, colors, supertypes, types, subtypes, categories, abilityTypes, keywords, legalities, rulings, ...fields } = input //eslint-disable-line
      return Models.Card
        .upsert({ name: fields.name }, fields)
        .then(model => {
          let card = model.toJSON()

          if (!!names) for (let name of names) Models.Names.findOrCreate({ card: card.id, name })

          if (!!colors) for (let color of colors) Models.CardColors.findOrCreate({ card: card.id, color })

          if (!!supertypes) for (let supertype of supertypes) Models.Supertypes.findOrCreate({ card: card.id, supertype })

          if (!!types) for (let type of types) Models.Types.findOrCreate({ card: card.id, type })

          if (!!subtypes) for (let subtype of subtypes) Models.Subtypes.findOrCreate({ card: card.id, subtype })

          return card
        })
        .catch(err => error(`Failed to run Mutation: update${Definition.name}`, err))
        .finally(info(`Resolved Mutation: update${Definition.name}`, { parent, input, context}))
    }
  },
  deleteCard: {
    type: Definition,
    description: `Deletes a Card by id`,
    args: { id: { type: GraphQLID } },
    resolve: (parent, args, context) => destroy(parent, args, context, Definition.name)
  }
}
