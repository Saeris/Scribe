import { Model } from "@/database"
import { bookshelfOptions } from "@/utilities"

@bookshelfOptions({ gid: false })
export class decklist extends Model {
  static fields(table) {
    table.string(`card`).notNullable()

    table.string(`deck`).notNullable()

    table.primary([`card`, `deck`])
  }
}
