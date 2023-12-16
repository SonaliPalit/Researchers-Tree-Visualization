const { Client } = require('pg');
 
const client = new Client({
  user: 'postgres',
  password: 'postgres',
  host: 'rds-research.c0xld5woukvf.us-east-2.rds.amazonaws.com',
  database: 'postgres',
  port: 5432,
  ssl: { 
    rejectUnauthorized: false,
    requestCert: false,
    connect: true
  },
})


module.exports = client;