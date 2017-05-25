import { GraphQLID, GraphQLNonNull, GraphQLInt, GraphQLEnumType, GraphQLString, GraphQLBoolean, GraphQLList, GraphQLObjectType, GraphQLInputObjectType } from 'graphql'
import { baseResolver, destroy, load, loadRelated, order, read } from './utilities'
import { info, error } from 'winston'
import Models from '../models'
import { Card, Set, Image, Artist } from './'

export const Input = new GraphQLInputObjectType({
  name: `PrintingInput`,
  description: `Required fields for a new Printing object`,
  fields: () => ({
    card:          { type: GraphQLID },
    set:           { type: GraphQLID },
    images:        { type: new GraphQLList(GraphQLID) },
    sides:         { type: new GraphQLList(GraphQLID) },
    variations:    { type: new GraphQLList(GraphQLID) },
    originalType:  { type: GraphQLString },
    originalText:  { type: GraphQLString },
    flavor:        { type: GraphQLString },
    artist:        { type: new GraphQLNonNull(GraphQLID) },
    number:        { type: GraphQLString },
    timeshifted:   { type: GraphQLBoolean },
    starter:       { type: GraphQLBoolean },
    reserved:      { type: GraphQLBoolean },
    source:        { type: GraphQLString }
  })
})

const Filter = new GraphQLInputObjectType({
  name: `PrintingFilter`,
  description: `Queryable fields for Printing.`,
  fields: () => ({
    card:          { type: new GraphQLList(GraphQLID) },
    set:           { type: new GraphQLList(GraphQLID) },
    originalType:  { type: GraphQLString },
    originalText:  { type: GraphQLString },
    flavor:        { type: GraphQLString },
    artist:        { type: new GraphQLList(GraphQLID) },
    number:        { type: new GraphQLList(GraphQLString) },
    timeshifted:   { type: GraphQLBoolean },
    starter:       { type: GraphQLBoolean },
    reserved:      { type: GraphQLBoolean }
  })
})

const Fields = new GraphQLEnumType({
  name: `PrintingFields`,
  description: `Field names for Printing.`,
  values: {
    card:          { value: `card` },
    set:           { value: `set` },
    originalType:  { type: `originalType`},
    originalText:  { value: `originalText` },
    artist:        { value: `artist` },
    number:        { value: `number` },
    timeshifted:   { value: `timeshifted` },
    starter:       { value: `starter` },
    reserved:      { value: `reserved` }
  }
})

export const Definition = new GraphQLObjectType({
  name: `Printing`,
  description: `A Printing object`,
  fields: () => ({
    id: {
      type: GraphQLID,
      description: `A unique id for this card.`
    },
    card: {
      type: Card.Definition,
      description: `The Card represented by this Printing.`,
      resolve: type => load(type.card, Models.Card)
    },
    set: {
      type: Set.Definition,
      description: `The set the card belongs to (set code).`,
      resolve: type => load(type.set, Models.Set)
    },
    images: {
      type: new GraphQLList(Image.Definition),
      description: `The card images. This includes a list of foreign images indexed by a language code. Example: enUS`,
      resolve: type => loadRelated(type.id, Models.Printing, `images`)
    },
    artist: {
      type: Artist.Definition,
      description: `The artist of the image. This may not match what is on the card as MTGJSON corrects many card misprints.`,
      resolve: type => load(type.artist, Models.Artist)
    },
    sides: {
      type: new GraphQLList(Definition),
      description: `Only used for split, flip and dual cards. Will contain a lit of cards representing each side of this card, front or back.`,
      resolve: type => loadRelated(type.id, Models.Card, `sides`)
    },
    variations: {
      type: new GraphQLList(Definition),
      description: `If a card has alternate art (for example, 4 different Forests, or the 2 Brothers Yamazaki) then each other variation’s card will be listed here, NOT including the current card.`,
      resolve: type => baseResolver(loadRelated(type.id, Models.Card, `variations`))
    },
    originalType: {
      type: GraphQLString,
      description: `The original type on the card at the time it was printed. This field is not available for promo cards.`
    },
    originalText: {
      type: GraphQLString,
      description: `The original text on the card at the time it was printed. This field is not available for promo cards.`
    },
    flavor: {
      type: GraphQLString,
      description: `The flavor text of the card.`
    },
    number: {
      type: GraphQLString,
      description: `The card number. This is printed at the bottom-center of the card in small text. This is a string, not an integer, because some cards have letters in their numbers.`
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
  printing: {
    type: new GraphQLList(Definition),
    description: `Returns a Printing.`,
    args: {
      id: { type: new GraphQLList(GraphQLID) },
      filter: {
        type: Filter
      },
      limit: { type: GraphQLInt },
      offset: { type: GraphQLInt },
      orderBy: { type: order(`printing`, Fields) }
    },
    resolve: (parent, args, context) => read(parent, args, context, Definition.name)
  }
}

export const Mutations = {
  createPrinting: {
    type: Definition,
    description: `Creates a new Printing`,
    args: { input: { type: Input } },
    resolve: (parent, { input }, context) => {
      let { images, sides, variations, ...fields } = input //eslint-disable-line
      return Models.Printing
        .findOrCreate(fields)
        .then(model => {
          let printing = model.toJSON()

          if (!!images) for (let image of images) Models.Images.findOrCreate({ printing: printing.id, image })

          Models.Printings.findOrCreate({ card: printing.card, printing: printing.id })

          return printing
        })
        .catch(err => error(`Failed to run Mutation: create${Definition.name}`, err))
        .finally(info(`Resolved Mutation: create${Definition.name}`, { parent, input, context}))
    }
  },
  updatePrinting: {
    type: Definition,
    description: `Updates an existing Printing, creates it if it does not already exist`,
    args: { input: { type: Input } },
    resolve: (parent, { input }, context) => {
      const { card, set, number, images, sides, variations, ...fields } = input //eslint-disable-line
      return Models.Printing
        .upsert({ card, set, number }, fields)
        .then(model => {
          let printing = model.toJSON()
          //console.log(model)
          if (!!images) for (let image of images) Models.Images.findOrCreate({ printing: printing.id, image })

          Models.Printings.findOrCreate({ card: printing.card, printing: printing.id })

          return printing
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
