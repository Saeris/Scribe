import { Model } from "@/database"
import { bookshelfOptions } from "@/utilities"

@bookshelfOptions({ gid: false })
export class binders extends Model {
  static fields(table) {
    table.string(`binder`).notNullable()

    table.string(`collection`).notNullable()

    table.primary([`binder`, `collection`])
  }
}
