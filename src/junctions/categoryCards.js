import { Model } from "@/database"
import { bookshelfOptions } from "@/utilities"

@bookshelfOptions({ gid: false })
export class categorycards extends Model {
  static fields(table) {
    table.string(`category`).notNullable()

    table.string(`card`).notNullable()

    table.primary([`category`, `card`])
  }
}
