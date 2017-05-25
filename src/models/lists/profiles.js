import db from '../../config/bookshelf.config'

export default class Profiles extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigInteger(`profile`)
      .comment(`The profile associated with this user.`)
      .notNullable()
      .unsigned()

    table.bigInteger(`user`)
      .comment(`The user associated with this profile.`)
      .notNullable()
      .unsigned()

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`profile`, `user`])
  }

  // Bookshelf Relation Definitions
  get tableName() { return `profiles` }

  get hasTimestamps() { return true }
}
