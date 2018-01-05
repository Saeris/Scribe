import { Model } from "@/database"
import { bookshelfOptions } from "@/utilities"

@bookshelfOptions({ gid: false })
export class collectioncards extends Model {
  static fields(table) {
    table.string(`collection`).notNullable()

    table.string(`card`).notNullable()

    table.primary([`collection`, `card`])
  }
}
