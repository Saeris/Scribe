import { Model } from "@/database"
import { bookshelfOptions } from "@/utilities"

@bookshelfOptions({ gid: false })
export class formatsets extends Model {
  static fields(table) {
    table.string(`format`).notNullable()

    table.string(`set`).notNullable()

    table.primary([`format`, `set`])
  }
}
