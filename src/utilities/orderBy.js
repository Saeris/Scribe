export const orderBy = args => {
  const sortBy = args.orderBy || `id`
  return sortBy.reduce((hash, { field, sort }) => {
    hash[field] = sort
    return hash
  }, {})
}
