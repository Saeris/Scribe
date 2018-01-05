export const sqlJoin = (parentField = `id`, targetField = `id`) =>
  (parent, target, args) => `${parent}.${parentField} = ${target}.${targetField}`
