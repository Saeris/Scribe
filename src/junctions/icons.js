import { Model } from "@/database"
import { bookshelfOptions } from "@/utilities"

@bookshelfOptions({ gid: false })
export class icons extends Model {
  static fields(table) {
    table.string(`layout`).notNullable()

    table.string(`icon`).notNullable()

    table.primary([`layout`, `icon`])
  }
}
