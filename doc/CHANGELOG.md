# Project Changelog

> *[Return to Directory](README.md)*

## v0.1.1

- Fixed the outstanding errors with SQLite3 migrations. Because SQLite3 does not supposrt adding foreign keys after a table is created, foreign key creation is now conditionally added based on the environment.
- Another issue with migrations was fixed by moving all table definitions back to a subfolder, because Knex's migrations API doesn't seem to allow you to exclude files.
- Added some documentation, including a project Roadmap and a Changelog.
- Added missing dependency Winston-Loggly-Bulk.
- Removed leftover references to previous express server implementation in routes.
