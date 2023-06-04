// Replace *** with your DB info

const mysql = require('mysql');

const pool  = mysql.createPool({
    connectionLimit: 10,
    host: "***",
     user: "***",
     password: "***",
     database: "***"
});

module.exports = pool;