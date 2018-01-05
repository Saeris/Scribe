import gql from 'graphql-tag'

const { log, error } = console

const users = [
  // Businesses
  { type: `Business`, username: `Amazon`, name: `Amazon`, email: `payments@amazon.com` },
  { type: `Business`, username: `PayPal`, name: `PayPal`, email: `payments@paypal.com` },
  { type: `Business`, username: `Newegg`, name: `Newegg`, email: `payments@newegg.com` },
  { type: `Business`, username: `Egghead.io`, name: `Egghead.io`, email: `payments@egghead.io` },
  { type: `Business`, username: `BlizzardEntertainment`, name: `Blizzard Entertainment`, email: `payments@blizzard.com` },
  { type: `Business`, username: `Valve`, name: `Valve Corp.`, email: `paypalsupport@valve.com` },
  { type: `Business`, username: `Comcast`, name: `Comcast`, email: `payments@comcast.com` },
  { type: `Business`, username: `Google`, name: `Google`, email: `payments@google.com` },
  { type: `Business`, username: `DigitalOcean`, name: `Digital Ocean, Inc.`, email: `support@digitalocean.com` },
  { type: `Business`, username: `HumbleBundle`, name: `Humble Bundle, Inc.`, email: `contact@humblebundle.com` },
  { type: `Business`, username: `ThinkGeek`, name: `ThinkGeek`, email: `payments@thinkgeek.com` },
  { type: `Business`, username: `WeLoveFine`, name: `Welovefine/mightyfineinc`, email: `yvette@mightyfineinc.com` },
  { type: `Business`, username: `J!NX`, name: `J!NX`, email: `support@jinx.com` },
  { type: `Business`, username: `CapitalOne`, name: `Capital One`, email: `payments@capitalone.com` },
  { type: `Business`, username: `eBay`, name: `eBay`, email: `payments@ebay.com` },
  { type: `Business`, username: `Corsair`, name: `Corsair`, email: `payments@corsair.com` },
  { type: `Business`, username: `Apple`, name: `Apple`, email: `payments@apple.com` },
  { type: `Business`, username: `Microsoft`, name: `Microsoft`, email: `payments@microsoft.com` },
  { type: `Business`, username: `Fandango`, name: `Fandango`, email: `payments@fandango.com` },
  { type: `Business`, username: `500px`, name: `500px Inc.`, email: `payments@500px.com` },
  { type: `Business`, username: `ChannelFireball`, name: `ChannelFireball.com`, email: `sales@channelfireball.com` },
  { type: `Business`, username: `UnitedAirelines`, name: `United Airlines, Inc.`, email: `sales@united.com` },
  { type: `Business`, username: `OvernightPrints`, name: `OverNightPrints.com`, email: `service@overnightprints.com` },
  { type: `Business`, username: `Fangamer`, name: `Fangamer LLC`, email: `orders@fangamer.com` },
  { type: `Business`, username: `Steelseries`, name: `Steelseries`, email: `orders@steelseries.com` },
  // Banks
  { type: `Bank`, username: `THEBANKCORP`, name: `Bank Account` },
  { type: `Bank`, username: `USBank`, name: `Bank Account` },
  // Users
  { type: `User`, username: `joecosta3`, firstName: `Joe`, lastName: `Costa`, email: `joecosta3@comcast.net` },
  { type: `User`, username: `saeris`, firstName: `Drake`, lastName: `Costa`, email: `drake@saeris.io` },
  { type: `User`, username: `kentcdodds`, firstName: `Kent`, lastName: `Dodds`, email: `kentcdodds@gmail.com` },
  { type: `User`, username: `jamundferguson`, firstName: `Jamund`, lastName: `Ferguson`, email: `jamuferguson@paypal.com` }
]

const createUser = async (client, input) => {
  try {
    const { data } = await client.mutate({
      mutation: gql`mutation createUser($input: userInput!) {
        createUser(input: $input) {
          id
          type
          username
        }
      }`,
      variables: { input }
    })
    log(`Successfully created user:`, data)
    return data
  } catch (err) {
    error(`Failed to create user.`, input, err)
  }
}

export const createUsers = client => {
  try {
    log(`Creating Users...`)
    const results = []
    for (const user of users) {
      results.push(createUser(client, user))
    }
    log(`Successfully added ${results.length} Users!`)
    return Promise.all(results) // eslint-disable-line
  } catch (err) {
    error(`Failed to add users.`, err)
  }
}
