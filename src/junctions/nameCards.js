import { Model } from "@/database"
import { bookshelfOptions } from "@/utilities"

@bookshelfOptions({ gid: false })
export class namecards extends Model {
  static fields(table) {
    table.string(`name`).notNullable()

    table.string(`card`).notNullable()

    table.primary([`name`, `card`])
  }
}
