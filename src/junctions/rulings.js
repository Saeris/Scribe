import { Model } from "@/database"
import { bookshelfOptions } from "@/utilities"

@bookshelfOptions({ gid: false })
export class rulings extends Model {
  static fields(table) {
    table.string(`card`).notNullable()

    table.string(`ruling`).notNullable()

    table.primary([`card`, `ruling`])
  }
}
