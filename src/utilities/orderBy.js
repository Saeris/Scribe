export const orderBy = ({ orderBy: by }) => by?.reduce((hash, { field, sort }) => {
  hash[field] = sort
  return hash
}, {}) || { id: `desc` }
