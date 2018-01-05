import { Model } from "@/database"
import { bookshelfOptions } from "@/utilities"

@bookshelfOptions({ gid: false })
export class categories extends Model {
  static fields(table) {
    table.string(`card`).notNullable()

    table.string(`category`).notNullable()

    table.primary([`card`, `category`])
  }
}
