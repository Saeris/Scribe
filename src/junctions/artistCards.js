import { Model } from "@/database"
import { bookshelfOptions } from "@/utilities"

@bookshelfOptions({ gid: false })
export class artistcards extends Model {
  static fields(table) {
    table.string(`artist`).notNullable()

    table.string(`card`).notNullable()

    table.primary([`artist`, `card`])
  }
}
