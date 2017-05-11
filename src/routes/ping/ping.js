export default class Ping {

  /** GET / - List all entities */
  list(req, res) {
    res.send(`pong`)
  }
}
