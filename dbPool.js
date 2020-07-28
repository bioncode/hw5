const mysql = require('mysql');

const pool  = mysql.createPool({
    connectionLimit: 10,
    host: "qf5dic2wzyjf1x5x.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "z5xsb3w0ilk30bt6",
    password: "ujinjrqf9oy03vyt",
    database: "yimeu8e596ri3f0l"
});

module.exports = pool;