import { Model } from "@/database"
import { bookshelfOptions } from "@/utilities"

@bookshelfOptions({ gid: false })
export class blocksets extends Model {
  static fields(table) {
    table.string(`block`).notNullable()

    table.string(`set`).notNullable()

    table.primary([`block`, `set`])
  }
}
