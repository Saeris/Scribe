import { Model } from "@/database"
import { bookshelfOptions } from "@/utilities"

@bookshelfOptions({ gid: false })
export class rulingcards extends Model {
  static fields(table) {
    table.string(`ruling`).notNullable()

    table.string(`card`).notNullable()

    table.primary([`ruling`, `card`])
  }
}
