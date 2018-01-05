import { Model } from "@/database"
import { bookshelfOptions } from "@/utilities"

@bookshelfOptions({ gid: false })
export class subtypes extends Model {
  static fields(table) {
    table.string(`card`).notNullable()

    table.string(`subtype`).notNullable()

    table.primary([`card`, `subtype`])
  }
}
