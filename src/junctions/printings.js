import { Model } from "@/database"
import { bookshelfOptions } from "@/utilities"

@bookshelfOptions({ gid: false })
export class printings extends Model {
  static fields(table) {
    table.string(`card`).notNullable()

    table.string(`printing`).notNullable()

    table.primary([`card`, `printing`])
  }
}
