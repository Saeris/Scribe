export const bookshelfOptions = (options = { name: null, gid: true, timestamps: true }) => Class =>
  class extends Class {
    get tableName() { return options.name ? options.name : super.constructor.name.toLowerCase() }

    get useGlobalID() { return options.gid }

    get hasTimestamps() { return [`created`, `updated`] }

    get softDelete() { return true }
  }
