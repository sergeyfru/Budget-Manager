const knex = require('knex')

const dotenv = require('dotenv')
dotenv.config()

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, PGPORT, PGURL } = process.env;
const db = knex({
    client: 'pg',
    connection: {
        // connectionString: PGURL,
        host: PGHOST,
        port: PGPORT,
        user: PGUSER,
        database: PGDATABASE,
        password: PGPASSWORD,

        ssl: {rejectUnauthorized: false},
    }
});

module.exports = { db }