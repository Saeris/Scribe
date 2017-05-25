import db from '../../config/bookshelf.config'
import { Name, Layout, Color, ColorIdentity, Supertype, Type, Subtype, Rarity, Category, AbilityType, Keyword, Legality, Ruling, Printing } from './'
import { Names, CardColors, Supertypes, Types, Subtypes, Categories, AbilityTypes, Keywords, Legalities, Rulings, Printings } from '../lists'

export default class Card extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigIncrements(`id`)
      .notNullable()
      .unsigned()
      .primary()
      .unique()

    table.string(`name`)
      .comment(`The English name of the card.`)
      .notNullable()
      .unique()

    table.string(`border`)
      .comment(`If the border for this specific card is DIFFERENT than the border specified in the top level set JSON, then it will be specified here. (Example: Unglued has silver borders, except for the lands which are black bordered)`)

    table.bigInteger(`layout`)
      .comment(`The card layout.`)
      .notNullable()
      .unsigned()

    table.string(`watermark`)
      .comment(`The watermark on the card. Note: Split cards don’t currently have this field set, despite having a watermark on each side of the split card.`)

    table.string(`manacost`)
      .comment(`The mana cost of this card. Consists of one or more mana symbols. (use cmc and colors to query)`)

    table.integer(`cmc`)
      .comment(`Converted mana cost.`)
      .notNullable()

    table.bigInteger(`colorIdentity`)
      .comment(`The card colors by color code. [“Red”, “Blue”] becomes [“R”, “U”]`)
      .notNullable()
      .unsigned()

    table.string(`typeLine`)
      .comment(`The card type. This is the type you would see on the card if printed today. Note: The dash is a UTF8 long dash as per the MTG rules.`)
      .notNullable()

    table.bigInteger(`rarity`)
      .comment(`The rarity of the card.`)
      .notNullable()
      .unsigned()

    table.text(`text`)
      .comment(`The text of the card.`)

    table.string(`hand`)
      .comment(`Maximum hand size modifier. Only exists for Vanguard cards.`)

    table.string(`life`)
      .comment(`Starting life total modifier. Only exists for Vanguard cards.`)

    table.string(`power`)
      .comment(`The power of the card. This is only present for creatures. This is a string, not an integer, because some cards have powers like: “1+*”`)

    table.string(`toughness`)
      .comment(`The toughness of the card. This is only present for creatures. This is a string, not an integer, because some cards have toughness like: “1+*”`)

    table.integer(`loyalty`)
      .comment(`The loyalty of the card. This is only present for planeswalkers.`)

    // Timestamps
    table.timestamps()
  }

  // Bookshelf Relation Definitions
  get tableName() { return `card` }

  get hasTimestamps() { return true }

  names = () => this.hasMany(Name, `id`).through(Names, `id`, `card`, `name`)

  layout = () => this.hasOne(Layout, `id`, `layout`)

  colors = () => this.hasMany(Color, `id`).through(CardColors, `id`, `card`, `color`)

  colorIdentity = () => this.hasOne(ColorIdentity, `id`, `colorIdentity`)

  supertypes = () => this.hasMany(Supertype, `id`).through(Supertypes, `id`, `card`, `supertype`)

  types = () => this.hasMany(Type, `id`).through(Types, `id`, `card`, `type`)

  subtypes = () => this.hasMany(Subtype, `id`).through(Subtypes, `id`, `card`, `subtype`)

  categories = () => this.hasMany(Category, `id`).through(Categories, `id`, `card`, `category`)

  keywords = () => this.hasMany(Keyword, `id`).through(Keywords, `id`, `card`, `keyword`)

  abilityTypes = () => this.hasMany(AbilityType, `id`).through(AbilityTypes, `id`, `card`, `abilityType`)

  legalities = () => this.hasMany(Legality, `id`).through(Legalities, `id`, `card`, `legality`)

  rulings = () => this.hasMany(Ruling, `id`).through(Rulings, `id`, `card`, `ruling`)

  printings = () => this.hasMany(Printing, `id`).through(Printings, `id`, `card`, `printing`)

  rarity = () => this.hasOne(Rarity, `id`, `rarity`)
}
