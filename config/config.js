import { config } from 'dotenv';
const envDBTest = config({path: __dirname + '/../.env.test'})['parsed'];
const envDB = config()['parsed'];

module.exports = {
  local: {
    username: envDB.DB_USERNAME,
    password: envDB.DB_PASSWORD,
    database: envDB.DB_DATABASE,
    options: {
      host: 'localhost',
      dialect: 'mysql',
    },
  },
  development: {
    username: envDB.DB_USERNAME,
    password: envDB.DB_PASSWORD,
    database: envDB.DB_DATABASE,
    options: {
      host: 'localhost',
      dialect: 'mysql',
    },
  },
  test: {
    username: envDBTest.DB_USERNAME,
    password: envDBTest.DB_PASSWORD,
    database: envDBTest.DB_DATABASE,
    options: {
      host: 'localhost',
      dialect: 'mysql',
    },
  },
  production: {
    username: envDB.DB_USERNAME,
    password: envDB.DB_PASSWORD,
    database: envDB.DB_DATABASE,
    options: {
      host: 'localhost',
      dialect: 'mysql',
    },
  }
};
