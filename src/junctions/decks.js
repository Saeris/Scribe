import { Model } from "@/database"
import { bookshelfOptions } from "@/utilities"

@bookshelfOptions({ gid: false })
export class decks extends Model {
  static fields(table) {
    table.string(`deck`).notNullable()

    table.string(`collection`).notNullable()

    table.primary([`deck`, `collection`])
  }
}
