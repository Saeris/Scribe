import hapiPlayground from "graphql-playground-middleware-hapi"

export default {
  register: hapiPlayground,
  options: {
    path: `/playground`,
    endpoint: `/graphql`
  }
}
