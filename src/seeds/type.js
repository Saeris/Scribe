export function seed(knex, Promise) {
  return knex(`type`).insert([
    {name: `Artifact`},
    {name: `Conspiracy`},
    {name: `Creature`},
    {name: `Enchantment`},
    {name: `Instant`},
    {name: `Land`},
    {name: `Phenomenon`},
    {name: `Plane`},
    {name: `Planeswalker`},
    {name: `Scheme`},
    {name: `Sorcery`},
    {name: `Tribal`},
    {name: `Vanguard`}
  ])
}
