require('dotenv').config();

module.exports = {
  development: {
    database: process.env.DEV_DATABASE_URL,
    host: process.env.DEV_DB_HOST,
    username: process.env.DEV_DB_USERNAME,
    password: process.env.DEV_DB_PASSWORD,
    port: process.env.DEV_DB_PORT,
    dialect: 'postgres'
  },
  test: {
    database: process.env.TEST_DATABASE_URL,
    host: process.env.TEST_DB_HOST,
    username: process.env.TEST_DB_USERNAME,
    password: process.env.TEST_DB_PASSWORD,
    port: process.env.TEST_DB_PORT,
    dialect: 'postgres'
  },
  production: {
    database: process.env.PROD_DATABASE_URL,
    host: process.env.PROD_DB_HOST,
    username: process.env.PROD_DB_USERNAME,
    password: process.env.PROD_DB_PASSWORD,
    port: process.env.PROD_DB_PORT,
    dialect: 'postgres'
  }
};
