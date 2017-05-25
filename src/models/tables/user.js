import db from '../../config/bookshelf.config'
import { Collection, Gender, Profile } from './'
import { Profiles } from '../lists'

export default class User extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigIncrements(`id`)
      .notNullable()
      .unsigned()
      .primary()
      .unique()

    table.string(`firstName`)
      .comment(`The first name of the user.`)
      .notNullable()

    table.string(`lastName`)
      .comment(`The last name of the user.`)
      .notNullable()

    table.bigInteger(`gender`)
      .comment(`The gender identity of the user.`)
      .notNullable()
      .unsigned()

    table.string(`username`)
      .comment(`The username of the user.`)
      .notNullable()

    table.string(`password`)
      .comment(`The password of the user.`)
      .notNullable()

    table.string(`email`)
      .comment(`The email address of the user.`)
      .notNullable()
      .unique()

    table.string(`location`)
      .comment(`The location of the user.`)

    table.bigInteger(`collection`)
      .comment(`The card collection of the user.`)
      .notNullable()
      .unsigned()
      .unique()

    // Timestamps
    table.timestamps()
  }

  // Bookshelf Relation Definitions
  get tableName() { return `user` }

  get hasTimestamps() { return true }

  gender = () => this.hasOne(Gender, `id`, `gender`)

  profiles = () => this.hasMany(Profile, `id`).through(Profiles, `id`, `profile`, `user`)

  collection = () => this.hasOne(Collection, `id`, `collection`)
}
