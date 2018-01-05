import { Model } from "@/database"
import { bookshelfOptions } from "@/utilities"

@bookshelfOptions({ gid: false })
export class supertypes extends Model {
  static fields(table) {
    table.string(`card`).notNullable()

    table.string(`supertype`).notNullable()

    table.primary([`card`, `supertype`])
  }
}
