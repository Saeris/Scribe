import { Model } from "@/database"
import { bookshelfOptions } from "@/utilities"

@bookshelfOptions({ gid: false })
export class bindercards extends Model {
  static fields(table) {
    table.string(`binder`).notNullable()

    table.string(`card`).notNullable()

    table.primary([`binder`, `card`])
  }
}
