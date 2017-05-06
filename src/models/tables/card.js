import db from '../../config/bookshelf.config'
import { Name, Image, Layout, Color, ColorIdentity, Supertype, Type, Subtype, Rarity, Set, Category, AbilityType, Keyword, Legality, Ruling, Artist } from './'
import { Names, Images, Sides, Variations, CardColors, Supertypes, Types, Subtypes, Categories, AbilityTypes, Keywords, Legalities, Rulings, Printings } from '../lists'

export default class Card extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigIncrements(`id`)
         .notNullable()
         .primary()

    table.string(`border`)
         .comment(`If the border for this specific card is DIFFERENT than the border specified in the top level set JSON, then it will be specified here. (Example: Unglued has silver borders, except for the lands which are black bordered)`)

    table.bigInteger(`layout`)
         .comment(`The card layout.`)
         .notNullable()
         .unsigned()
         .index(`card_layout`)

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
         .index(`card_colorIdentity`)

    table.string(`typeLine`)
         .comment(`The card type. This is the type you would see on the card if printed today. Note: The dash is a UTF8 long dash as per the MTG rules.`)
         .notNullable()

    table.string(`originaltype`)
         .comment(`The original type on the card at the time it was printed. This field is not available for promo cards.`)

    table.bigInteger(`rarity`)
         .comment(`The rarity of the card.`)
         .notNullable()
         .unsigned()
         .index(`card_rarity`)

    table.bigInteger(`set`)
         .comment(`The set the card belongs to.`)
         .notNullable()
         .unsigned()
         .index(`card_set`)

    table.text(`text`)
         .comment(`The text of the card.`)

    table.text(`originaltext`)
         .comment(`The original text on the card at the time it was printed. This field is not available for promo cards.`)

    table.text(`flavor`)
         .comment(`The flavor text of the card.`)

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

    table.bigInteger(`artist`)
         .comment(`The artist of the card. This may not match what is on the card as MTGJSON corrects many card misprints.`)
         .notNullable()
         .unsigned()
         .index(`card_artist`)

    table.string(`number`)
         .comment(`The card number. This is printed at the bottom-center of the card in small text. This is a string, not an integer, because some cards have letters in their numbers.`)
         .notNullable()

    table.date(`releasedate`)
         .comment(`The date this card was released. This is only set for promo cards. The date may not be accurate to an exact day and month, thus only a partial date may be set (YYYY-MM-DD or YYYY-MM or YYYY). Some promo cards do not have a known release date.`)

    table.boolean(`timeshifted`)
         .comment(`If this card was a timeshifted card in the set.`)

    table.boolean(`starter`)
         .comment(`Set to true if this card was only released as part of a core box set. These are technically part of the core sets and are tournament legal despite not being available in boosters.`)

    table.boolean(`reserved`)
         .comment(`Set to true if this card is reserved by Wizards Official Reprint Policy.`)

    table.string(`source`)
         .comment(`For promo cards, this is where this card was originally obtained. For box sets that are theme decks, this is which theme deck the card is from.`)

    // Timestamps
    table.timestamps()
  }

  static foreignKeys(table) {
    table.foreign(`id`)
         .references(`card`)
         .inTable(`names`)
         .onDelete(`CASCADE`)
         .onUpdate(`NO ACTION`)

    table.foreign(`id`)
         .references(`id`)
         .inTable(`image`)
         .onDelete(`CASCADE`)
         .onUpdate(`NO ACTION`)

    table.foreign(`id`)
         .references(`card`)
         .inTable(`sides`)
         .onDelete(`CASCADE`)
         .onUpdate(`NO ACTION`)

    table.foreign(`id`)
         .references(`card`)
         .inTable(`variations`)
         .onDelete(`CASCADE`)
         .onUpdate(`NO ACTION`)

    table.foreign(`layout`)
         .references(`id`)
         .inTable(`layout`)
         .onDelete(`NO ACTION`)
         .onUpdate(`NO ACTION`)

    table.foreign(`id`)
         .references(`card`)
         .inTable(`cardColors`)
         .onDelete(`NO ACTION`)
         .onUpdate(`NO ACTION`)

    table.foreign(`colorIdentity`)
         .references(`id`)
         .inTable(`coloridentity`)
         .onDelete(`NO ACTION`)
         .onUpdate(`NO ACTION`)

    table.foreign(`id`)
         .references(`card`)
         .inTable(`supertypes`)
         .onDelete(`CASCADE`)
         .onUpdate(`NO ACTION`)

    table.foreign(`id`)
         .references(`card`)
         .inTable(`types`)
         .onDelete(`CASCADE`)
         .onUpdate(`NO ACTION`)

    table.foreign(`id`)
         .references(`card`)
         .inTable(`subtypes`)
         .onDelete(`CASCADE`)
         .onUpdate(`NO ACTION`)

    table.foreign(`rarity`)
         .references(`id`)
         .inTable(`rarity`)
         .onDelete(`NO ACTION`)
         .onUpdate(`NO ACTION`)

    table.foreign(`set`)
         .references(`id`)
         .inTable(`set`)
         .onDelete(`NO ACTION`)
         .onUpdate(`NO ACTION`)

    table.foreign(`id`)
         .references(`card`)
         .inTable(`categories`)
         .onDelete(`CASCADE`)
         .onUpdate(`NO ACTION`)

    table.foreign(`id`)
         .references(`card`)
         .inTable(`abilitytypes`)
         .onDelete(`CASCADE`)
         .onUpdate(`NO ACTION`)

    table.foreign(`id`)
         .references(`card`)
         .inTable(`keywords`)
         .onDelete(`CASCADE`)
         .onUpdate(`NO ACTION`)

    table.foreign(`id`)
         .references(`card`)
         .inTable(`legalities`)
         .onDelete(`CASCADE`)
         .onUpdate(`NO ACTION`)

    table.foreign(`id`)
         .references(`card`)
         .inTable(`rulings`)
         .onDelete(`CASCADE`)
         .onUpdate(`NO ACTION`)

    table.foreign(`artist`)
         .references(`id`)
         .inTable(`artist`)
         .onDelete(`NO ACTION`)
         .onUpdate(`NO ACTION`)

    table.foreign(`id`)
         .references(`card`)
         .inTable(`printings`)
         .onDelete(`CASCADE`)
         .onUpdate(`NO ACTION`)
  }

  // Bookshelf Relation Definitions
  get tableName() { return `card` }

  get hasTimestamps() { return true }

  names = () => this.hasMany(Name, `id`).through(Names, `id`, `card`, `name`)

  sides = () => this.hasMany(Card, `id`).through(Sides, `id`, `card`, `side`)

  variations = () => this.hasMany(Card, `id`).through(Variations, `id`, `card`, `variation`)

  images = () => this.hasMany(Image, `id`).through(Images, `id`, `card`, `image`)

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

  set = () => this.hasOne(Set, `id`, `set`)

  printings = () => this.hasMany(Set, `id`).through(Printings, `id`, `card`, `set`)

  rarity = () => this.hasOne(Rarity, `id`, `rarity`)

  artist = () => this.hasOne(Artist, `id`, `artist`)
}
