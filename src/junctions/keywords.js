import { Model } from "@/database"
import { bookshelfOptions } from "@/utilities"

@bookshelfOptions({ gid: false })
export class keywords extends Model {
  static fields(table) {
    table.string(`card`).notNullable()

    table.string(`keyword`).notNullable()

    table.primary([`card`, `keyword`])
  }
}
