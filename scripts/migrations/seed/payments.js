import gql from 'graphql-tag'

const { log, error } = console

const payments = [
  // 1-10
  { to: `saeris`, from: `THEBANKCORP`, amount: 500, currency: `USD`, category: `MoneyTransfers`, type: `Transfer` },
  { to: `joecosta3`, from: `saeris`, amount: 65, currency: `USD`, category: `MoneyTransfers`, type: `Transfer`, purpose: `Here's for helping me with moving!` },
  { to: `Amazon`, from: `saeris`, amount: 59.99, currency: `USD`, category: `Gifts`, type: `Payment` },
  { to: `Amazon`, from: `saeris`, amount: 71.18, currency: `USD`, category: `Hardware`, type: `Payment` },
  { to: `ChannelFireball`, from: `saeris`, amount: 50, currency: `USD`, category: `Hobbies`, type: `Payment` },
  { to: `saeris`, from: `joecosta3`, amount: 150, currency: `USD`, category: `MoneyTransfers`, type: `Transfer`, purpose: `Happy Birthday!` },
  { to: `Newegg`, from: `saeris`, amount: 59.99, currency: `USD`, category: `Hardware`, type: `Payment` },
  { to: `Valve`, from: `saeris`, amount: 59.67, currency: `USD`, category: `Games`, type: `Payment` },
  { to: `saeris`, from: `Valve`, amount: 59.67, currency: `USD`, category: `Reimbursement`, type: `Transfer` },
  { to: `saeris`, from: `USBank`, amount: 1000, currency: `USD`, category: `MoneyTransfers`, type: `Transfer` },
  // 11-20
  { to: `saeris`, from: `THEBANKCORP`, amount: 500, currency: `USD`, category: `MoneyTransfers`, type: `Transfer` },
  { to: `joecosta3`, from: `saeris`, amount: 65, currency: `USD`, category: `MoneyTransfers`, type: `Transfer`, purpose: `Here's for helping me with moving!` },
  { to: `Amazon`, from: `saeris`, amount: 59.99, currency: `USD`, category: `Gifts`, type: `Payment` },
  { to: `Amazon`, from: `saeris`, amount: 71.18, currency: `USD`, category: `Hardware`, type: `Payment` },
  { to: `ChannelFireball`, from: `saeris`, amount: 50, currency: `USD`, category: `Hobbies`, type: `Payment` },
  { to: `saeris`, from: `joecosta3`, amount: 150, currency: `USD`, category: `MoneyTransfers`, type: `Transfer`, purpose: `Happy Birthday!` },
  { to: `Newegg`, from: `saeris`, amount: 59.99, currency: `USD`, category: `Hardware`, type: `Payment` },
  { to: `Valve`, from: `saeris`, amount: 59.67, currency: `USD`, category: `Games`, type: `Payment` },
  { to: `saeris`, from: `Valve`, amount: 59.67, currency: `USD`, category: `Reimbursement`, type: `Transfer` },
  { to: `saeris`, from: `USBank`, amount: 1000, currency: `USD`, category: `MoneyTransfers`, type: `Transfer` },
  // 21-30
  { to: `saeris`, from: `THEBANKCORP`, amount: 500, currency: `USD`, category: `MoneyTransfers`, type: `Transfer` },
  { to: `joecosta3`, from: `saeris`, amount: 65, currency: `USD`, category: `MoneyTransfers`, type: `Transfer`, purpose: `Here's for helping me with moving!` },
  { to: `Amazon`, from: `saeris`, amount: 59.99, currency: `USD`, category: `Gifts`, type: `Payment` },
  { to: `Amazon`, from: `saeris`, amount: 71.18, currency: `USD`, category: `Hardware`, type: `Payment` },
  { to: `ChannelFireball`, from: `saeris`, amount: 50, currency: `USD`, category: `Hobbies`, type: `Payment` },
  { to: `saeris`, from: `joecosta3`, amount: 150, currency: `USD`, category: `MoneyTransfers`, type: `Transfer`, purpose: `Happy Birthday!` },
  { to: `Newegg`, from: `saeris`, amount: 59.99, currency: `USD`, category: `Hardware`, type: `Payment` },
  { to: `Valve`, from: `saeris`, amount: 59.67, currency: `USD`, category: `Games`, type: `Payment` },
  { to: `saeris`, from: `Valve`, amount: 59.67, currency: `USD`, category: `Reimbursement`, type: `Transfer` },
  { to: `saeris`, from: `USBank`, amount: 1000, currency: `USD`, category: `MoneyTransfers`, type: `Transfer` },
  // 31-40
  { to: `saeris`, from: `THEBANKCORP`, amount: 500, currency: `USD`, category: `MoneyTransfers`, type: `Transfer` },
  { to: `joecosta3`, from: `saeris`, amount: 65, currency: `USD`, category: `MoneyTransfers`, type: `Transfer`, purpose: `Here's for helping me with moving!` },
  { to: `Amazon`, from: `saeris`, amount: 59.99, currency: `USD`, category: `Gifts`, type: `Payment` },
  { to: `Amazon`, from: `saeris`, amount: 71.18, currency: `USD`, category: `Hardware`, type: `Payment` },
  { to: `ChannelFireball`, from: `saeris`, amount: 50, currency: `USD`, category: `Hobbies`, type: `Payment` },
  { to: `saeris`, from: `joecosta3`, amount: 150, currency: `USD`, category: `MoneyTransfers`, type: `Transfer`, purpose: `Happy Birthday!` },
  { to: `Newegg`, from: `saeris`, amount: 59.99, currency: `USD`, category: `Hardware`, type: `Payment` },
  { to: `Valve`, from: `saeris`, amount: 59.67, currency: `USD`, category: `Games`, type: `Payment` },
  { to: `saeris`, from: `Valve`, amount: 59.67, currency: `USD`, category: `Reimbursement`, type: `Transfer` },
  { to: `saeris`, from: `USBank`, amount: 1000, currency: `USD`, category: `MoneyTransfers`, type: `Transfer` },
  // 41-50
  { to: `saeris`, from: `THEBANKCORP`, amount: 500, currency: `USD`, category: `MoneyTransfers`, type: `Transfer` },
  { to: `joecosta3`, from: `saeris`, amount: 65, currency: `USD`, category: `MoneyTransfers`, type: `Transfer`, purpose: `Here's for helping me with moving!` },
  { to: `Amazon`, from: `saeris`, amount: 59.99, currency: `USD`, category: `Gifts`, type: `Payment` },
  { to: `Amazon`, from: `saeris`, amount: 71.18, currency: `USD`, category: `Hardware`, type: `Payment` },
  { to: `ChannelFireball`, from: `saeris`, amount: 50, currency: `USD`, category: `Hobbies`, type: `Payment` },
  { to: `saeris`, from: `joecosta3`, amount: 150, currency: `USD`, category: `MoneyTransfers`, type: `Transfer`, purpose: `Happy Birthday!` },
  { to: `Newegg`, from: `saeris`, amount: 59.99, currency: `USD`, category: `Hardware`, type: `Payment` },
  { to: `Valve`, from: `saeris`, amount: 59.67, currency: `USD`, category: `Games`, type: `Payment` },
  { to: `saeris`, from: `Valve`, amount: 59.67, currency: `USD`, category: `Reimbursement`, type: `Transfer` },
  { to: `saeris`, from: `USBank`, amount: 1000, currency: `USD`, category: `MoneyTransfers`, type: `Transfer` },
  // 51-60
  { to: `saeris`, from: `THEBANKCORP`, amount: 500, currency: `USD`, category: `MoneyTransfers`, type: `Transfer` },
  { to: `joecosta3`, from: `saeris`, amount: 65, currency: `USD`, category: `MoneyTransfers`, type: `Transfer`, purpose: `Here's for helping me with moving!` },
  { to: `Amazon`, from: `saeris`, amount: 59.99, currency: `USD`, category: `Gifts`, type: `Payment` },
  { to: `Amazon`, from: `saeris`, amount: 71.18, currency: `USD`, category: `Hardware`, type: `Payment` },
  { to: `ChannelFireball`, from: `saeris`, amount: 50, currency: `USD`, category: `Hobbies`, type: `Payment` },
  { to: `saeris`, from: `joecosta3`, amount: 150, currency: `USD`, category: `MoneyTransfers`, type: `Transfer`, purpose: `Happy Birthday!` },
  { to: `Newegg`, from: `saeris`, amount: 59.99, currency: `USD`, category: `Hardware`, type: `Payment` },
  { to: `Valve`, from: `saeris`, amount: 59.67, currency: `USD`, category: `Games`, type: `Payment` },
  { to: `saeris`, from: `Valve`, amount: 59.67, currency: `USD`, category: `Reimbursement`, type: `Transfer` },
  { to: `saeris`, from: `USBank`, amount: 1000, currency: `USD`, category: `MoneyTransfers`, type: `Transfer` },
  // 61-70
  { to: `saeris`, from: `THEBANKCORP`, amount: 500, currency: `USD`, category: `MoneyTransfers`, type: `Transfer` },
  { to: `joecosta3`, from: `saeris`, amount: 65, currency: `USD`, category: `MoneyTransfers`, type: `Transfer`, purpose: `Here's for helping me with moving!` },
  { to: `Amazon`, from: `saeris`, amount: 59.99, currency: `USD`, category: `Gifts`, type: `Payment` },
  { to: `Amazon`, from: `saeris`, amount: 71.18, currency: `USD`, category: `Hardware`, type: `Payment` },
  { to: `ChannelFireball`, from: `saeris`, amount: 50, currency: `USD`, category: `Hobbies`, type: `Payment` },
  { to: `saeris`, from: `joecosta3`, amount: 150, currency: `USD`, category: `MoneyTransfers`, type: `Transfer`, purpose: `Happy Birthday!` },
  { to: `Newegg`, from: `saeris`, amount: 59.99, currency: `USD`, category: `Hardware`, type: `Payment` },
  { to: `Valve`, from: `saeris`, amount: 59.67, currency: `USD`, category: `Games`, type: `Payment` },
  { to: `saeris`, from: `Valve`, amount: 59.67, currency: `USD`, category: `Reimbursement`, type: `Transfer` },
  { to: `saeris`, from: `USBank`, amount: 1000, currency: `USD`, category: `MoneyTransfers`, type: `Transfer` },
  // 71-80
  { to: `saeris`, from: `THEBANKCORP`, amount: 500, currency: `USD`, category: `MoneyTransfers`, type: `Transfer` },
  { to: `joecosta3`, from: `saeris`, amount: 65, currency: `USD`, category: `MoneyTransfers`, type: `Transfer`, purpose: `Here's for helping me with moving!` },
  { to: `Amazon`, from: `saeris`, amount: 59.99, currency: `USD`, category: `Gifts`, type: `Payment` },
  { to: `Amazon`, from: `saeris`, amount: 71.18, currency: `USD`, category: `Hardware`, type: `Payment` },
  { to: `ChannelFireball`, from: `saeris`, amount: 50, currency: `USD`, category: `Hobbies`, type: `Payment` },
  { to: `saeris`, from: `joecosta3`, amount: 150, currency: `USD`, category: `MoneyTransfers`, type: `Transfer`, purpose: `Happy Birthday!` },
  { to: `Newegg`, from: `saeris`, amount: 59.99, currency: `USD`, category: `Hardware`, type: `Payment` },
  { to: `Valve`, from: `saeris`, amount: 59.67, currency: `USD`, category: `Games`, type: `Payment` },
  { to: `saeris`, from: `Valve`, amount: 59.67, currency: `USD`, category: `Reimbursement`, type: `Transfer` },
  { to: `saeris`, from: `USBank`, amount: 1000, currency: `USD`, category: `MoneyTransfers`, type: `Transfer` },
  // 81-90
  { to: `saeris`, from: `THEBANKCORP`, amount: 500, currency: `USD`, category: `MoneyTransfers`, type: `Transfer` },
  { to: `joecosta3`, from: `saeris`, amount: 65, currency: `USD`, category: `MoneyTransfers`, type: `Transfer`, purpose: `Here's for helping me with moving!` },
  { to: `Amazon`, from: `saeris`, amount: 59.99, currency: `USD`, category: `Gifts`, type: `Payment` },
  { to: `Amazon`, from: `saeris`, amount: 71.18, currency: `USD`, category: `Hardware`, type: `Payment` },
  { to: `ChannelFireball`, from: `saeris`, amount: 50, currency: `USD`, category: `Hobbies`, type: `Payment` },
  { to: `saeris`, from: `joecosta3`, amount: 150, currency: `USD`, category: `MoneyTransfers`, type: `Transfer`, purpose: `Happy Birthday!` },
  { to: `Newegg`, from: `saeris`, amount: 59.99, currency: `USD`, category: `Hardware`, type: `Payment` },
  { to: `Valve`, from: `saeris`, amount: 59.67, currency: `USD`, category: `Games`, type: `Payment` },
  { to: `saeris`, from: `Valve`, amount: 59.67, currency: `USD`, category: `Reimbursement`, type: `Transfer` },
  { to: `saeris`, from: `USBank`, amount: 1000, currency: `USD`, category: `MoneyTransfers`, type: `Transfer` },
  // 91-100
  { to: `saeris`, from: `THEBANKCORP`, amount: 500, currency: `USD`, category: `MoneyTransfers`, type: `Transfer` },
  { to: `joecosta3`, from: `saeris`, amount: 65, currency: `USD`, category: `MoneyTransfers`, type: `Transfer`, purpose: `Here's for helping me with moving!` },
  { to: `Amazon`, from: `saeris`, amount: 59.99, currency: `USD`, category: `Gifts`, type: `Payment` },
  { to: `Amazon`, from: `saeris`, amount: 71.18, currency: `USD`, category: `Hardware`, type: `Payment` },
  { to: `ChannelFireball`, from: `saeris`, amount: 50, currency: `USD`, category: `Hobbies`, type: `Payment` },
  { to: `saeris`, from: `joecosta3`, amount: 150, currency: `USD`, category: `MoneyTransfers`, type: `Transfer`, purpose: `Happy Birthday!` },
  { to: `Newegg`, from: `saeris`, amount: 59.99, currency: `USD`, category: `Hardware`, type: `Payment` },
  { to: `Valve`, from: `saeris`, amount: 59.67, currency: `USD`, category: `Games`, type: `Payment` },
  { to: `saeris`, from: `Valve`, amount: 59.67, currency: `USD`, category: `Reimbursement`, type: `Transfer` },
  { to: `saeris`, from: `USBank`, amount: 1000, currency: `USD`, category: `MoneyTransfers`, type: `Transfer` }
]

const sendPayment = async (client, input) => {
  try {
    const { data } = await client.mutate({
      mutation: gql`mutation sendPayment($input: paymentInput) {
        sendPayment(input: $input) {
          id
        }
      }`,
      variables: { input }
    })
    log(`Successfully made payment:`, data)
    return data
  } catch (err) {
    error(`Failed to make payment.`, input, err)
  }
}

export const sendPayments = client => {
  try {
    log(`Sending Payments...`)
    const results = []
    for (const { to, from, ...rest } of payments) {
      results.push(sendPayment(client, {
        to: { where: `Username`, equals: to },
        from: { where: `Username`, equals: from },
        ...rest
      }))
    }
    log(`Successfully sent ${results.length} Payments!`)
    return Promise.all(results) // eslint-disable-line
  } catch (err) {
    error(`Failed to send payments.`, err)
  }
}
