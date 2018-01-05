import {
  nodeInterface,
  DateRange,
  createFilter,
  createInput,
  createOrder,
  destroy,
  sqlJoin,
  junction,
  orderBy,
  where
} from "@/utilities"
import { NameConnection, NameFilter, NameOrder } from './name'
import { Layout, LayoutFilter, LayoutOrder } from './layout'
import { ColorConnection, ColorFilter, ColorOrder } from './color'
import { ColorIdentity, ColorIdentityFilter, ColorIdentityOrder } from './colorIdentity'
import { CategoryConnection, CategoryFilter, CategoryOrder } from './category'
import { AbilityTypeConnection, AbilityTypeFilter, AbilityTypeOrder } from './abilityType'
import { KeywordConnection, KeywordFilter, KeywordOrder } from './keyword'
import { LegalityConnection, LegalityFilter, LegalityOrder } from './legality'
import { RulingConnection, RulingFilter, RulingOrder } from './ruling'
import { PrintingConnection, PrintingFilter, PrintingOrder } from './printing'

export const Definition = new GqlObject({
  name: `Card`,
  description: `A Card object`,
  interfaces: [nodeInterface],
  sqlTable: `card`,
  uniqueKey: `id`,
  timestamps: table => table.timestamps(),
  fields: disabled => ({
    globalId: {
      ...globalId(),
      description: `The global ID for the Relay spec`,
      sqlDeps: [`id`]
    },
    id: {
      type: new GqlNonNull(GqlID),
      description: `The Card ID.`,
      sqlColumn: `id`,
      column: table => table.string(`id`).notNullable().primary().unique()
    },
    created: {
      type: new GqlNonNull(GqlDateTime),
      sqlColumn: `created`,
      sortable: true,
      filter: { type: DateRange }
    },
    updated: {
      type: new GqlNonNull(GqlDateTime),
      sqlColumn: `updated`,
      sortable: true,
      filter: { type: DateRange }
    },
    name: {
      type: new GqlNonNull(GqlString),
      description: `The Card's English name.`,
      sqlColumn: `name`,
      column: table => table.string(`name`).notNullable().unique(),
      input: true,
      sortable: true,
      filter: { type: new GqlList(new GqlNonNull(GqlString)) }
    },
    names: {
      type: NameConnection,
      description: `The card names. This includes a list of foreign names indexed by a language code. Example: enUS`,
      args: { ...connectionArgs, ...NameFilter, ...NameOrder },
      junction: junction(`names`),
      where,
      orderBy,
      resolve: ({ names }, args) => connectionFromArray(names, args)
    },
    border: {
      type: GqlString,
      description: `If the border for this specific card is DIFFERENT than the border specified in the top level set JSON, then it will be specified here. (Example: Unglued has silver borders, except for the lands which are black bordered)`,
      sqlColumn: `border`,
      column: table => table.string(`border`),
      input: true,
      sortable: true,
      filter: { type: new GqlList(new GqlNonNull(GqlString)) }
    },
    layout: {
      type: new GqlNonNull(Layout),
      description: `The Card Layout.`,
      sqlColumn: `layout`,
      column: table => table.string(`layout`).notNullable(),
      input: { type: new GqlNonNull(GqlID) },
      args: { ...LayoutFilter, ...LayoutOrder },
      where,
      orderBy,
      sqlJoin: sqlJoin(`layout`)
    },
    watermark: {
      type: GqlString,
      description: `The watermark on the card. Note: Split cards don’t currently have this field set, despite having a watermark on each side of the split card.`,
      sqlColumn: `watermark`,
      column: table => table.string(`watermark`),
      input: true,
      sortable: true,
      filter: { type: new GqlList(new GqlNonNull(GqlString)) }
    },
    manacost: {
      type: GqlString,
      description: `The mana cost of this card. Consists of one or more mana symbols. (use cmc and colors to query)`,
      sqlColumn: `manacost`,
      column: table => table.string(`manacost`),
      input: true,
      sortable: true,
      filter: { type: new GqlList(new GqlNonNull(GqlString)) }
    },
    cmc: {
      type: new GqlNonNull(GqlInt),
      description: `Converted mana cost.`,
      sqlColumn: `cmc`,
      column: table => table.integer(`cmc`).notNullable(),
      input: true,
      sortable: true,
      filter: { type: new GqlList(new GqlNonNull(GqlInt)) }
    },
    colors: {
      type: ColorConnection,
      description: `The card colors.`,
      args: { ...connectionArgs, ...ColorFilter, ...ColorOrder },
      junction: junction(`cardcolors`),
      where,
      orderBy,
      resolve: ({ colors }, args) => connectionFromArray(colors, args)
    },
    colorIdentity: {
      type: new GqlNonNull(ColorIdentity),
      description: `The card colors by color code. [“Red”, “Blue”] becomes [“R”, “U”]`,
      sqlColumn: `colorIdentity`,
      column: table => table.string(`colorIdentity`).notNullable(),
      input: { type: new GqlNonNull(GqlID) },
      args: { ...ColorIdentityFilter, ...ColorIdentityOrder },
      where,
      orderBy,
      sqlJoin: sqlJoin(`colorIdentity`)
    },
    typeLine: {
      type: new GqlNonNull(GqlString),
      description: `The card type. This is the type you would see on the card if printed today. Note: The dash is a UTF8 'long dash’ as per the MTG rules.`,
      sqlColumn: `typeLine`,
      column: table => table.string(`typeLine`).notNullable().unique(),
      input: true,
      sortable: true,
      filter: { type: new GqlList(new GqlNonNull(GqlString)) }
    },
    supertypes: {
      type: new GqlList(GqlString),
      description: `The supertypes of the card. These appear to the far left of the card type.`,
      junction: junction(`supertypes`),
      filter: { type: new GqlList(new GqlNonNull(GqlString)) },
      resolve: ({ supertypes }, args) => supertypes.map(supertype => supertype.name)
    },
    types: {
      type: new GqlList(GqlString),
      description: `The types of the card. These appear to the left of the dash in a card type.`,
      junction: junction(`types`),
      filter: { type: new GqlList(new GqlNonNull(GqlString)) },
      resolve: ({ types }, args) => types.map(type => type.name)
    },
    subtypes: {
      type: new GqlList(GqlString),
      description: `The subtypes of the card. These appear to the right of the dash in a card type. Usually each word is its own subtype.`,
      junction: junction(`subtypes`),
      filter: { type: new GqlList(new GqlNonNull(GqlString)) },
      resolve: ({ subtypes }, args) => subtypes.map(subtype => subtype.name)
    },
    rarity: {
      type: new GqlNonNull(GqlString),
      description: `The rarity of the card.`,
      sqlJoin: sqlJoin(`rarity`),
      filter: { type: new GqlList(new GqlNonNull(GqlString)) },
      resolve: ({ rarity }, args) => rarity.name
    },
    text: {
      type: GqlString,
      description: `The oracle text of the card. May contain mana symbols and other symbols.`,
      sqlColumn: `text`,
      column: table => table.string(`text`),
      input: true,
      sortable: true,
      filter: { type: new GqlList(new GqlNonNull(GqlString)) }
    },
    categories: {
      type: CategoryConnection,
      description: `A list of categories describind this card. Examples: Acceleration, Removal`,
      args: { ...connectionArgs, ...CategoryFilter, ...CategoryOrder },
      junction: junction(`categories`),
      where,
      orderBy,
      resolve: ({ categories }, args) => connectionFromArray(categories, args)
    },
    abilityTypes: {
      type: AbilityTypeConnection,
      description: `A list of Ability Types this card has. Examples: Activated, Triggered`,
      args: { ...connectionArgs, ...AbilityTypeFilter, ...AbilityTypeOrder },
      junction: junction(`abilityTypes`),
      where,
      orderBy,
      resolve: ({ abilityTypes }, args) => connectionFromArray(abilityTypes, args)
    },
    keywords: {
      type: KeywordConnection,
      description: `A list of keyword abilities this card has. Examples: Haste, Trample`,
      args: { ...connectionArgs, ...KeywordFilter, ...KeywordOrder },
      junction: junction(`keywords`),
      where,
      orderBy,
      resolve: ({ keywords }, args) => connectionFromArray(keywords, args)
    },
    hand: {
      type: GqlString,
      description: `Maximum hand size modifier. Only exists for Vanguard cards.`,
      sqlColumn: `hand`,
      column: table => table.string(`hand`),
      input: true,
      sortable: true,
      filter: { type: new GqlList(new GqlNonNull(GqlString)) }
    },
    life: {
      type: GqlString,
      description: `Starting life total modifier. Only exists for Vanguard cards.`,
      sqlColumn: `life`,
      column: table => table.string(`life`),
      input: true,
      sortable: true,
      filter: { type: new GqlList(new GqlNonNull(GqlString)) }
    },
    power: {
      type: GqlString,
      description: `The power of the card. This is only present for creatures. This is a string, not an integer, because some cards have powers like: “1+*”`,
      sqlColumn: `power`,
      column: table => table.string(`power`),
      input: true,
      sortable: true,
      filter: { type: new GqlList(new GqlNonNull(GqlString)) }
    },
    toughness: {
      type: GqlString,
      description: `The toughness of the card. This is only present for creatures. This is a string, not an integer, because some cards have toughness like: “1+*”`,
      sqlColumn: `toughness`,
      column: table => table.string(`toughness`),
      input: true,
      sortable: true,
      filter: { type: new GqlList(new GqlNonNull(GqlString)) }
    },
    loyalty: {
      type: GqlInt,
      description: `The loyalty of the card. This is only present for planeswalkers.`,
      sqlColumn: `loyalty`,
      column: table => table.string(`loyalty`),
      input: true,
      sortable: true,
      filter: { type: new GqlList(new GqlNonNull(GqlString)) }
    },
    legalities: {
      type: LegalityConnection,
      description: `The legality of the card for a given format, such as Legal, Banned or Restricted.`,
      args: { ...connectionArgs, ...LegalityFilter, ...LegalityOrder },
      junction: junction(`legalities`),
      where,
      orderBy,
      resolve: ({ legalities }, args) => connectionFromArray(legalities, args)
    },
    rulings: {
      type: RulingConnection,
      description: `The rulings for the card. An array of objects, each object having 'date’ and 'text’ keys.`,
      args: { ...connectionArgs, ...RulingFilter, ...RulingOrder },
      junction: junction(`rulings`),
      where,
      orderBy,
      resolve: ({ rulings }, args) => connectionFromArray(rulings, args)
    },
    printings: {
      type: PrintingConnection,
      description: `The sets that this card was printed in, expressed as an array of set codes.`,
      args: { ...connectionArgs, ...PrintingFilter, ...PrintingOrder },
      junction: junction(`printings`),
      where,
      orderBy,
      resolve: ({ printings }, args) => connectionFromArray(printings, args)
    }
  })
})

export const { connectionType: Connection } = connectionDefinitions({ nodeType: Definition })
export const Filter = createFilter(Definition)
export const Input = createInput(Definition)
export const Order = createOrder(Definition)

export const Queries = {
  card: {
    type: Connection,
    description: `Returns a list of Cards.`,
    args: { ...connectionArgs, ...Filter, ...Order },
    where,
    orderBy,
    resolve: ({ card }, args) => connectionFromArray(card, args)
  }
}

export const Mutations = {
  createCard: {
    type: Definition,
    description: `Creates a new Card`,
    args: { input: { type: Input } },
    resolve: (parent, { input }, context) => {
      const { names, colors, supertypes, types, subtypes, categories, abilityTypes, keywords, legalities, rulings, ...fields } = input //eslint-disable-line
      /*
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
        */
    }
  },
  updateCard: {
    type: Definition,
    description: `Updates an existing Card, creates it if it does not already exist`,
    args: { id: { type: new GqlNonNull(GqlID) }, ...Input },
    resolve: (parent, { input }, context) => {
      const { names, colors, supertypes, types, subtypes, categories, abilityTypes, keywords, legalities, rulings, ...fields } = input //eslint-disable-line
      /*
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
        */
    }
  },
  deleteCard: {
    type: Definition,
    description: `Deletes a Card by id`,
    args: { id: { type: new GqlNonNull(GqlID) } },
    resolve: destroy
  }
}

export {
  Definition as Card,
  Connection as CardConnection,
  Filter as CardFilter,
  Input as CardInput,
  Order as CardOrder
}

export default { Definition, Queries, Mutations }
