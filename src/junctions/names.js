import { Model } from "@/database"
import { bookshelfOptions } from "@/utilities"

@bookshelfOptions({ gid: false })
export class names extends Model {
  static fields(table) {
    table.string(`card`).notNullable()

    table.string(`name`).notNullable()

    table.primary([`card`, `name`])
  }
}
