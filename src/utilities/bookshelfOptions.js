export const bookshelfOptions = (options = {name: null, gid: true, timestamps: true}) => Class =>
  class extends Class {
    constructor(...args) {
      super(...args)
    }

    get tableName() { return !!options.name ? options.name : super.constructor.name.toLowerCase() }

    get useGlobalID() { return options.gid }

    get hasTimestamps() { return options.gid }
  }
