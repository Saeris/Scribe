import db from '../../config/bookshelf.config'
import Name from './name'
import Layout from './layout'
import Sides from '../lists/sides'
import Variations from '../lists/variations'
import Color from './color'
import ColorIdentity from './colorIdentity'
import Supertype from './supertype'
import Type from './type'
import Subtype from './subtype'
import Rarity from './rarity'
import Set from './set'
import Category from './category'
import AbilityType from './abilityType'
import Keyword from './keyword'
import Legality from './legality'
import Ruling from './ruling'
import Artist from './artist'
import Printings from '../lists/printings'

export default class Card extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigIncrements(`id`)
         .notNullable()
         .primary()

    table.string(`multiverseid`)
         .comment(`The multiverseid of the card on Wizard’s Gatherer web page. Cards from sets that do not exist on Gatherer will NOT have a multiverseid.`)
         .notNullable()

    table.bigInteger(`names`)
         .comment(`The card names. This includes a list of foreign names indexed by a language code. Example: enUS`)
         .notNullable()
         .unsigned()
         .index(`card_names`)

    table.bigInteger(`sides`)
         .comment(`Only used for split, flip and dual cards. Will contain a lit of cards representing each side of this card, front or back.`)
         .unsigned()
         .index(`card_sides`)

    table.bigInteger(`variations`)
         .comment(`If a card has alternate art (for example, 4 different Forests, or the 2 Brothers Yamazaki) then each other variation’s card will be listed here, NOT including the current card.`)
         .unsigned()
         .index(`card_variations`)

    table.string(`border`)
         .comment(`If the border for this specific card is DIFFERENT than the border specified in the top level set JSON, then it will be specified here. (Example: Unglued has silver borders, except for the lands which are black bordered)`)

    table.bigInteger(`layout`)
         .comment(`The card layout.`)
         .notNullable()
         .unsigned()
         .index(`card_layout`)

    table.string(`image`)
         .comment(`The image url for a card. Only exists if the card has a multiverse id.`)
         .notNullable()

    table.string(`manacost`)
         .comment(`The mana cost of this card. Consists of one or more mana symbols. (use cmc and colors to query)`)

    table.integer(`cmc`)
         .comment(`Converted mana cost.`)
         .notNullable()

    table.bigInteger(`coloridentity`)
         .comment(`The card colors by color code. [“Red”, “Blue”] becomes [“R”, “U”]`)
         .notNullable()
         .unsigned()
         .index(`card_coloridentity`)

    table.string(`typeLine`)
         .comment(`The card type. This is the type you would see on the card if printed today. Note: The dash is a UTF8 long dash as per the MTG rules.`)
         .notNullable()

    table.string(`originaltype`)
         .comment(`The original type on the card at the time it was printed. This field is not available for promo cards.`)

    table.bigInteger(`supertypes`)
         .comment(`The supertypes of the card. These appear to the far left of the card type.`)
         .unsigned()
         .index(`card_supertypes`)

    table.bigInteger(`types`)
         .comment(`The types of the card. These appear to the left of the dash in a card type.`)
         .notNullable()
         .unsigned()
         .index(`card_types`)

    table.bigInteger(`subtypes`)
         .comment(`The subtypes of the card. These appear to the right of the dash in a card type. Usually each word is its own subtype.`)
         .unsigned()
         .index(`card_subtypes`)

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
         .notNullable()

    table.text(`originaltext`)
         .comment(`The original text on the card at the time it was printed. This field is not available for promo cards.`)

    table.bigInteger(`categories`)
         .comment(`A list of categories describind this card. Examples: Acceleration, Removal`)
         .unsigned()
         .index(`card_categories`)

    table.bigInteger(`abilitytypes`)
         .comment(`A list of Ability Types this card has. Examples: Activated, Triggered`)
         .unsigned()
         .index(`card_abilityTypes`)

    table.bigInteger(`keywords`)
         .comment(`A list of keyword abilities this card has. Examples: Haste, Trample`)
         .unsigned()
         .index(`card_keywords`)

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

    table.bigInteger(`legalities`)
         .comment(`The legality of the card for a given format, such as Legal, Banned or Restricted.`)
         .notNullable()
         .unsigned()
         .index(`card_legalities`)

    table.bigInteger(`rulings`)
         .comment(`The rulings for the card. An array of objects, each object having date and text keys.`)
         .unsigned()
         .index(`card_rulings`)

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

    table.bigInteger(`printings`)
         .comment(`The sets that this card was printed in, expressed as an array of set codes.`)
         .notNullable()
         .unsigned()
         .index(`card_printings`)

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
    table.foreign(`names`)
         .references(`card`)
         .inTable(`names`)
         .onDelete(`CASCADE`)
         .onUpdate(`NO ACTION`)

    table.foreign(`sides`)
         .references(`card`)
         .inTable(`sides`)
         .onDelete(`CASCADE`)
         .onUpdate(`NO ACTION`)

    table.foreign(`variations`)
         .references(`card`)
         .inTable(`variations`)
         .onDelete(`CASCADE`)
         .onUpdate(`NO ACTION`)

    table.foreign(`layout`)
         .references(`id`)
         .inTable(`layout`)
         .onDelete(`NO ACTION`)
         .onUpdate(`NO ACTION`)

    table.foreign(`coloridentity`)
         .references(`id`)
         .inTable(`coloridentity`)
         .onDelete(`NO ACTION`)
         .onUpdate(`NO ACTION`)

    table.foreign(`supertypes`)
         .references(`card`)
         .inTable(`supertypes`)
         .onDelete(`CASCADE`)
         .onUpdate(`NO ACTION`)

    table.foreign(`types`)
         .references(`card`)
         .inTable(`types`)
         .onDelete(`CASCADE`)
         .onUpdate(`NO ACTION`)

    table.foreign(`subtypes`)
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

    table.foreign(`categories`)
         .references(`card`)
         .inTable(`categories`)
         .onDelete(`CASCADE`)
         .onUpdate(`NO ACTION`)

    table.foreign(`abilityTypes`)
         .references(`card`)
         .inTable(`abilitytypes`)
         .onDelete(`CASCADE`)
         .onUpdate(`NO ACTION`)

    table.foreign(`keywords`)
         .references(`card`)
         .inTable(`keywords`)
         .onDelete(`CASCADE`)
         .onUpdate(`NO ACTION`)

    table.foreign(`legalities`)
         .references(`card`)
         .inTable(`legalities`)
         .onDelete(`CASCADE`)
         .onUpdate(`NO ACTION`)

    table.foreign(`rulings`)
         .references(`card`)
         .inTable(`rulings`)
         .onDelete(`CASCADE`)
         .onUpdate(`NO ACTION`)

    table.foreign(`artist`)
         .references(`id`)
         .inTable(`artist`)
         .onDelete(`NO ACTION`)
         .onUpdate(`NO ACTION`)

    table.foreign(`printings`)
         .references(`card`)
         .inTable(`printings`)
         .onDelete(`CASCADE`)
         .onUpdate(`NO ACTION`)
  }

  // Bookshelf Relation Definitions
  get tableName() { return `card` }

  get hasTimestamps() { return true }

  names() {
    return this.hasMany(Name, `names`)
  }

  sides() {
    return this.hasMany(Card, `sides`)
               .through(Sides, `card`)
  }

  variations() {
    return this.hasMany(Card, `variations`)
               .through(Variations, `card`)
  }

  colors() {
    return this.hasMany(Color, `colors`)
  }

  supertypes() {
    return this.hasMany(Supertype, `supertypes`)
  }

  types() {
    return this.hasMany(Type, `types`)
  }

  subtypes() {
    return this.hasMany(Subtype, `subtypes`)
  }

  categories() {
    return this.hasMany(Category, `categories`)
  }

  abilityTypes() {
    return this.hasMany(AbilityType, `abilityTypes`)
  }

  keywords() {
    return this.hasMany(Keyword, `keywords`)
  }

  legalities() {
    return this.hasMany(Legality, `legalities`)
  }

  rulings() {
    return this.hasMany(Ruling, `rulings`)
  }

  artist() {
    return this.hasone(Artist, `artist`)
  }

  printings() {
    return this.hasMany(Card, `printings`)
               .through(Printings, `card`)
  }
}
