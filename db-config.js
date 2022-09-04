const mysql = require('mysql2');
require("dotenv").config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: 'root',
    password: process.env.DB_PASSWORD,
    database: 'jerryWMB'
});
  
module.exports = { connection };