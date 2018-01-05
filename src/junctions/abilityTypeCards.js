import { Model } from "@/database"
import { bookshelfOptions } from "@/utilities"

@bookshelfOptions({ gid: false })
export class abilitytypecards extends Model {
  static fields(table) {
    table.string(`abilitytype`).notNullable()

    table.string(`card`).notNullable()

    table.primary([`abilitytype`, `card`, `active`])
  }
}
