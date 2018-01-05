import { Model } from "@/database"
import { bookshelfOptions } from "@/utilities"

@bookshelfOptions({ gid: false })
export class images extends Model {
  static fields(table) {
    table.string(`printing`).notNullable()

    table.string(`image`).notNullable()

    table.primary([`printing`, `image`])
  }
}
