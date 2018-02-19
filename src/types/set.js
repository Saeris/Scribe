import {
  nodeInterface,
  DateRange,
  createFilter,
  createInput,
  createOrder,
  //create,
  read,
  //update,
  destroy,
  sqlJoin,
  orderBy,
  where
} from "@/utilities"
import { Block, BlockFilter, BlockOrder } from "./block"
import { SetType, SetTypeFilter, SetTypeOrder } from "./setType"
import { Icon, IconFilter, IconOrder } from "./icon"
import { Booster, BoosterFilter, BoosterOrder } from "./booster"

export const Definition = new GqlObject({
  name: `Set`,
  description: `A Set object`,
  interfaces: [nodeInterface],
  sqlTable: `set`,
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
      description: `The Set ID.`,
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
      description: `The name of the Set.`,
      sqlColumn: `name`,
      column: table => table.string(`name`).notNullable().unique(),
      input: true,
      sortable: true,
      filter: { type: new GqlList(GqlString) }
    },
    code: {
      type: new GqlNonNull(GqlString),
      description: `The set code for this Set.`,
      sqlColumn: `code`,
      column: table => table.string(`code`).notNullable().unique(),
      input: true,
      sortable: true,
      filter: { type: new GqlList(GqlString) }
    },
    block: {
      type: !disabled && new GqlNonNull(Block),
      description: `The Block the Set belongs to.`,
      column: table => table.string(`block`).notNullable(),
      input: { type: new GqlNonNull(GqlID) },
      args: { ...BlockFilter, ...BlockOrder },
      where,
      orderBy,
      sqlJoin: sqlJoin(`block`)
    },
    type: {
      type: !disabled && new GqlNonNull(SetType),
      description: `The Set type.`,
      column: table => table.string(`type`).notNullable(),
      input: { type: new GqlNonNull(GqlID) },
      args: { ...SetTypeFilter, ...SetTypeOrder },
      where,
      orderBy,
      sqlJoin: sqlJoin(`type`)
    },
    icon: {
      type: !disabled && new GqlNonNull(Icon),
      description: `The Icon associated with the Set.`,
      column: table => table.string(`icon`).notNullable(),
      input: { type: new GqlNonNull(GqlID) },
      args: { ...IconFilter, ...IconOrder },
      where,
      orderBy,
      sqlJoin: sqlJoin(`icon`)
    },
    border: {
      type: new GqlNonNull(GqlString),
      description: `The card border color for this Set.`,
      sqlColumn: `border`,
      column: table => table.string(`border`).notNullable(),
      input: true,
      sortable: true,
      filter: { type: new GqlList(GqlString) }
    },
    releaseDate: {
      type: new GqlNonNull(GqlDateTime),
      description: `The date this card was released. This is only set for promo cards. The date may not be accurate to an exact day and month, thus only a partial date may be set (YYYY-MM-DD or YYYY-MM or YYYY). Some promo cards do not have a known release date.`,
      sortable: true,
      filter: { type: DateRange }
    },
    booster: {
      type: !disabled && new GqlNonNull(Booster),
      description: `A booster pack for this set`,
      column: table => table.string(`booster`).notNullable(),
      input: { type: new GqlNonNull(GqlID) },
      args: { ...BoosterFilter, ...BoosterOrder },
      where,
      orderBy,
      sqlJoin: sqlJoin(`booster`)
    }
  })
})

export const { connectionType: Connection } = connectionDefinitions({ nodeType: Definition })
export const Filter = createFilter(Definition)
export const Input = createInput(Definition)
export const Order = createOrder(Definition)

export const Queries = {
  set: {
    type: new GqlList(Definition),
    description: `Returns a Set.`,
    args: { ...Filter, ...Order },
    where,
    orderBy,
    resolve: read
  }
}

export const Mutations = {
  createSet: {
    type: Definition,
    description: `Creates a new Set`,
    args: { ...Input }
    /*
    resolve: (parent, { input }, context) => Models.Set
      .findOrCreate(input)
      .then(model => {
        const set = model.toJSON()

        if (!!set.block) Models.BlockSets.findOrCreate({ block: set.block, set: set.id })

        return set
      })
      .catch(err => error(`Failed to run Mutation: create${Definition.name}`, err))
      .finally(info(`Resolved Mutation: create${Definition.name}`, { parent, input, context }))
      */
  },
  updateSet: {
    type: Definition,
    description: `Updates an existing Set, creates it if it does not already exist`,
    args: { id: { type: new GqlNonNull(GqlID) }, ...Input },
    resolve: (parent, { input }, context) => {
      /*
      const { name, ...fields } = input
      return Models.Set
        .upsert({ name }, { ...fields })
        .then(model => {
          const set = model.toJSON()

          if (!!set.block) Models.BlockSets.findOrCreate({ block: set.block, set: set.id })

          return set
        })
        .catch(err => error(`Failed to run Mutation: update${Definition.name}`, err))
        .finally(info(`Resolved Mutation: update${Definition.name}`, { parent, input, context}))
      */
    }
  },
  deleteSet: {
    type: Definition,
    description: `Deletes a Set by id`,
    args: { id: { type: new GqlNonNull(GqlID) } },
    resolve: destroy
  }
}

export {
  Definition as CardSet,
  Connection as CardSetConnection,
  Filter as CardSetFilter,
  Input as CardSetInput,
  Order as CardSetOrder
}

export default { Definition, Queries, Mutations }
