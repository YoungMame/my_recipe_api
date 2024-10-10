var mysql      = require('mysql');
var dotenv = require("dotenv");

dotenv.config();
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

async function connectDB() {
    return new Promise((resolve, reject) => {
        connection.connect((err) => {
          if (err) {
            console.error("Error connecting to the database:", err);
            reject(err);
          } else {
            console.log("Connection with database established");
            resolve();
          }
        });
    });
};

module.exports = {
    connection,
    connectDB,
};