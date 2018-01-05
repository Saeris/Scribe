import { Model } from "@/database"
import { bookshelfOptions } from "@/utilities"

@bookshelfOptions({ gid: false })
export class sides extends Model {
  static fields(table) {
    table.string(`card`).notNullable()

    table.string(`side`).notNullable()

    table.primary([`card`, `side`])
  }
}
