import { Model } from "@/database"
import { bookshelfOptions } from "@/utilities"

@bookshelfOptions({ gid: false })
export class abilitytypes extends Model {
  static fields(table) {
    table.string(`card`).notNullable()

    table.string(`abilitytype`).notNullable()

    table.primary([`card`, `abilitytype`])
  }
}
