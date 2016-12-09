export function seed(knex, Promise) {
  return knex('supertype').insert([
    {name: "Basic"},
    {name: "Legendary"},
    {name: "Ongoing"},
    {name: "Snow"},
    {name: "World"}
  ])
}
