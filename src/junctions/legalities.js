import { Model } from "@/database"
import { bookshelfOptions } from "@/utilities"

@bookshelfOptions({ gid: false })
export class legalities extends Model {
  static fields(table) {
    table.string(`card`).notNullable()

    table.string(`legality`).notNullable()

    table.primary([`card`, `legality`])
  }
}
