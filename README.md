# Scribe
*A GraphQL Magic: The Gathering API Server*

## <a name="contents"></a> Table of Contents

  - [Getting Started](#start)
  - [Installation](#install)
  - [Running the Server Locally](#run)
  - [Running the Server in Production](#production)
  - [Resetting the Database](#reset)
  - [License Information](#license)
  - [Prior Art](#priorart)
  - [Further Reading](doc/README.md)

## <a name="start"></a> Getting Started

> *[Back to Top](#contents)*

## <a name="install"></a> Installation

Before you start, make sure you have a working [NodeJS](http://nodejs.org/) environment, with NPM 3. Preferably use [Yarn](https://yarnpkg.com/) instead of NPM for installation of packages to ensure that you'll use exactly the same dependencies as the project.

From the project folder, execute the following command:

```shell
npm install
```

Or if you are using Yarn, execute this command instead:

```shell
yarn
```

Once installation of project dependencies completes, run the following command to set up your local development environment:

```shell
npm run setup
```

First this will create a default `.env` file in which you can define various environment variables such as your MySQL connection details, should you like to use it instead of SQLite3. `.env` is used to store sensitive information you do not want to commit.

Second, it will create a new database file under `src/scribe.sqlite` to serve as your default local development database. It will then run a set of Knex.js migrations to set up the default database schema.

Your development environment is now ready to go!

> *[Back to Top](#contents)*

## <a name="run"></a> Running the Server Locally

To start the server, simply run the following command:

```shell
npm start
```

The server should now be listening on port `1337`. To access GraphiQL and begin exploring the API documentation, navigate to [http://127.0.0.1:1337/graphiql](http://127.0.0.1:1337/graphiql) in your browser of choice.

Next, you can begin to populate your newly created database by running the following in a second terminal window:

```shell
npm run populate
```

This will populate the database with data from the [Magic: The Gathering API](https://docs.magicthegathering.io/) and download all card images to `src/images`.

> **Please note:** `populate` may take many hours to fully run! You can cancel the script at any time during execution. It is recommended that you at least allow it to run until some cards from the first set are added to the database in order to have a decent amount of seed data to play with. Execution may run faster using MySQL instead of SQlite3. Please refer to [Running the Server in Production](#production) for more information.

> *[Back to Top](#contents)*

## <a name="production"></a> Running the Server in Production

If you would like to run the server in "production" mode, you will first need to install and setup [MySQL](https://dev.mysql.com/downloads/mysql/) on your local machine. Once complete, set your connection details in `.env`. Scribe uses this file to configure the database connection, otherwise it will use defaults defined in `src/config/server.config.js`.

To reset your production database schema, run:

```shell
npm run resetdb:prod
```

> **Warning:** this will first attempt to **drop** any database named 'scribe'.

When completed, you can then run the server in production using:

```shell
npm run start:prod
```

To switch back to development, simply run:

```shell
npm run start:dev
```

> *[Back to Top](#contents)*

## <a name="license"></a> Resetting the Database

To delete all the data in the database and start from scratch, run one of the following commands:

**Development (Sqlite3):**
```shell
npm run resetdb
```

**Production (MySQL):**
```shell
npm run resetdb:prod
```

This is useful when making changes to the database schema, the populate script, or simply when you need to clear out existing data.

> *[Back to Top](#contents)*

## <a name="license"></a> License Information

This application uses images and data that are copyright of Wizards of the Coast (http://magic.wizards.com/en)

Scribe is made available under the MIT License (https://opensource.org/licenses/mit-license.html)

Attribution is greatly appreciated! Please feel free to fork the project and submit pull requests.

> *[Back to Top](#contents)*

## <a name="priorart"></a> Prior Art

Scribe would not be possible without the fantastic work of
Andrew Backes @adback03 on his [Magic: The Gathering API](https://magicthegathering.io/) project.

> *[Back to Top](#contents)*
