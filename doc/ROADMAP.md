# Project Roadmap

> *[Return to Directory](README.md)*

## v0.2.0

- [ ] Refactor Types/Models to condense data schema into one place per table.
- [ ] Write basic project documentation (setup, getting started, etc) ie: [README](../README.md)
- [ ] Wire-up Hapi Routes
- [X] Troubleshoot remaining issues with SQLite Migrations / Knex schema
- [ ] Add remaining Bookshelf Model Relations
- [ ] Add pagination query arguments for lists

## v0.3.0

- [ ] Add remaining mutations to enable populating the database via the API
- [ ] Add private tables / type definitions
  - [ ] Tables: Account, Collection, Binders, Decks, OwnedCards, misc
  - [ ] Type definitions/queries/mutations for above

## v0.4.0

- [ ] Setup login/signup REST API
- [ ] Add authentication layer to GraphQL API for private Tables
- [ ] Add rate-limiting to public GraphQL API

## v0.5.0

- [ ] Add application state history table / frontend utility APIs
- [ ] Add trading API / services
  - [ ] Create service to grab pricing data from public API sources
  - [ ] Add GraphQL types/queries to expose pricing data
  - [ ] Add tables / type definitions for Trading platform

## v0.6.0

- [ ] Refactor GraphQL resolvers to use batch SQL querying (speculative)
- [ ] ...?
