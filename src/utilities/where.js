import { isBoolean, isString, isArray } from "lodash"
import sqlString from "sqlstring"

const getOperator = operator => {
  switch (operator) {
    case `gte`: return `>=`
    case `gt`: return `>`
    case `lt`: return `<`
    case `lte`: return `<=`
    case `not`: return `<>`
    default: return `=`
  }
}

const withinRange = ({ value, date, min, startDate, max, endDate, operator }) => {
  const rangeValue = date?.getTime() || value
  const rangeMin = startDate?.getTime() || min
  const rangeMax = endDate?.getTime() || max
  if (rangeValue) return `${getOperator(operator)} ${sqlString.escape(rangeValue)}`
  return `BETWEEN ${sqlString.escape(rangeMin)} AND ${sqlString.escape(rangeMax)}`
}

export const where = (table, { filter: { conditions, combination } }, context) => conditions
  .map(({ field, rule }) => {
    if (isArray(rule)) return `${table}.${field} IN (${sqlString.escape(rule)})`
    if (isString(rule) || isBoolean(rule)) return `${table}.${field} = ${sqlString.escape(rule)}`
    return `${table}.${field} ${withinRange(rule)}`
  }).join(` ${combination} `)
