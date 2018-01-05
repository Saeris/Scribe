import {
  nodeInterface,
  DateRange,
  createFilter,
  //createInput,
  createOrder
  //create,
  //read,
  //update,
  //destroy,
  //junction,
  //orderBy,
  //where
} from "@/utilities"

export const Definition = new GqlObject({
  name: `Booster`,
  description: `A Booster object`,
  interfaces: [nodeInterface],
  sqlTable: `booster`,
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
      description: `The Booster ID.`,
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
    }
  })
})

export const { connectionType: Connection } = connectionDefinitions({ nodeType: Definition })
export const Filter = createFilter(Definition)
//export const Input = createInput(Definition)
export const Order = createOrder(Definition)

export const Queries = {

}

export const Mutations = {

}

export {
  Definition as Booster,
  Connection as BoosterConnection,
  Filter as BoosterFilter,
  //Input as BoosterInput,
  Order as BoosterOrder
}

export default { Definition, Queries, Mutations }
