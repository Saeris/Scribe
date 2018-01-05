import { Model } from "@/database"
import { bookshelfOptions } from "@/utilities"

@bookshelfOptions({ gid: false })
export class types extends Model {
  static fields(table) {
    table.string(`card`).notNullable()

    table.string(`type`).notNullable()

    table.primary([`card`, `type`])
  }
}
