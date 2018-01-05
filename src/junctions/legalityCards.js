import { Model } from "@/database"
import { bookshelfOptions } from "@/utilities"

@bookshelfOptions({ gid: false })
export class legalitycards extends Model {
  static fields(table) {
    table.string(`legality`).notNullable()

    table.string(`card`).notNullable()

    table.primary([`legality`, `card`])
  }
}
