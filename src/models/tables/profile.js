import db from '../../config/bookshelf.config'

export default class Profile extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigIncrements(`id`)
      .notNullable()
      .unsigned()
      .primary()
      .unique()

    table.string(`service`)
      .comment(`The name of the social media service.`)
      .notNullable()

    table.string(`token`)
      .comment(`The access token issued by the social media service.`)
      .notNullable()
      .unique()

    // Timestamps
    table.timestamps()
  }

  // Bookshelf Relation Definitions
  get tableName() { return `profile` }

  get hasTimestamps() { return true }
}
