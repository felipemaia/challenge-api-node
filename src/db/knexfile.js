// Update with your config settings.
const { knexSnakeCaseMappers } = require('objection');

module.exports = {


  development: {
    client: 'postgresql',
    connection: {
      database: 'challenge',
      user:     'postgres',
      password: 'postgres',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
    seeds: {
      directory: './seeds',
    },
    ...knexSnakeCaseMappers,
  },
};
