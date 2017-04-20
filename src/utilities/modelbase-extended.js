export default Bookshelf => {
  Bookshelf.Model = Bookshelf.Model.extend({
    findAll: (filter, options) => this
      .forge()
      .where(extend({}, filter))
      .fetchAll(options),

    findById: (id, options) => this
      .findOne({ [this.prototype.idAttribute]: id }, options),

    findOne: (query, options) => this
      .forge(query)
      .fetch({ require: true, ...options }),

    create: (data, options) => this
      .forge(data)
      .save(null, options),

    update: (data, options) => {
      options = { patch: true, require: true, ...options }
      return this
      .forge({ [this.prototype.idAttribute]: options.id })
      .fetch(options)
      .then(model => model ? model.save(data, options) : undefined)
    },

    destroy: (id, options) => this
      .forge({ [this.prototype.idAttribute]: id })
      .destroy({ require: true, ...options }),

    findOrCreate: (data, options) => this
      .findOne(data, { ...options, require: false })
      .bind(this)
      .then(model => {
        let defaults = options && options.defaults
        return model || this.create(extend(defaults, data), options)
      }),

    upsert: (selectData, updateData, options) => this
      .findOne(selectData, { ...options, require: false })
      .bind(this)
      .then(model => model
          ? model.save(updateData, { patch: true, method: `update`, ...options})
          : this.create(extend(selectData, updateData), { ...options, method: `insert` })
      )
  })
}
