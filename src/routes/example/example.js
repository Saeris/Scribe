export default class Example {

  /** GET / - List all entities */
  list(req, res) {
    res.json({
      message: `yay I work!`
    })
  }

  /** POST / - Create a new entity */
  create(req, res) {
    console.log(req.body)
    res.json(req.body)
  }

  /** GET /:id - Return a given entity */
  read(req, res) {

  }

  /** PUT /:id - Update a given entity */
  update(req, res) {

  }

  /** DELETE /:id - Delete a given entity */
  delete(req, res) {

  }
}
