import { Model } from "@/database"
import { bookshelfOptions } from "@/utilities"

@bookshelfOptions({ gid: false })
export class tags extends Model {
  static fields(table) {
    table.string(`item`).notNullable()

    table.string(`tag`).notNullable()

    table.primary([`item`, `tag`])
  }
}
