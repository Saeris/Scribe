import { Model } from "@/database"
import { bookshelfOptions } from "@/utilities"

@bookshelfOptions({ gid: false })
export class cardcolors extends Model {
  static fields(table) {
    table.string(`card`).notNullable()

    table.string(`color`).notNullable()

    table.primary([`card`, `color`])
  }
}
