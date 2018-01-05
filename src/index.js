import lambdaPlayground from 'graphql-playground-middleware-lambda'
import server from "./server"

// Server setup is derived from two of my other projects:
// https://github.com/Saeris/Flickr-Wormhole
// https://github.com/Saeris/Scribe
// There's a write-up explaining how the first one works in detail on the Serverless Blog:
// https://serverless.com/blog/3rd-party-rest-api-to-graphql-serverless/
exports.server = async (event, context, response) => {
  const { path, queryStringParameters: params, httpMethod: method, body: payload, headers: reqHeaders } = event

  let url = path
  if (params) {
    const qs = Object.keys(params).map(key => `${key}=${params[key]}`)
    if (qs.length > 0) url = `${url}?${qs.join(`&`)}`
  }

  const { statusCode, headers, result: body } = await server.inject({
    method,
    url,
    payload,
    headers: reqHeaders,
    validate: false
  })

  delete headers[`content-encoding`]
  delete headers[`transfer-encoding`]
  response(null, { statusCode, headers, body })
}

exports.playground = lambdaPlayground({
  endpoint: `/graphql`
})
