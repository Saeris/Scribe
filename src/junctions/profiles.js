import { Model } from "@/database"
import { bookshelfOptions } from "@/utilities"

@bookshelfOptions({ gid: false })
export class profiles extends Model {
  static fields(table) {
    table.string(`profile`).notNullable()

    table.string(`user`).notNullable()

    table.primary([`profile`, `user`])
  }
}
