import { Model } from "@/database"
import { bookshelfOptions } from "@/utilities"

@bookshelfOptions({ gid: false })
export class keywordcards extends Model {
  static fields(table) {
    table.string(`keyword`).notNullable()

    table.string(`card`).notNullable()

    table.primary([`keyword`, `card`])
  }
}
