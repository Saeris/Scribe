import { Model } from "@/database"
import { bookshelfOptions } from "@/utilities"

@bookshelfOptions({ gid: false })
export class variations extends Model {
  static fields(table) {
    table.string(`card`).notNullable()

    table.string(`variation`).notNullable()

    table.primary([`card`, `variation`])
  }
}
