import { Model } from "@/database"
import { bookshelfOptions } from "@/utilities"

@bookshelfOptions({ gid: false })
export class colors extends Model {
  static fields(table) {
    table.string(`colorIdentity`).notNullable()

    table.string(`color`).notNullable()

    table.primary([`colorIdentity`, `color`])
  }
}
