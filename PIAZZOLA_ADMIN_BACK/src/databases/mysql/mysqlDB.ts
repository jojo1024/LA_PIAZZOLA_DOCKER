
import mysql from "mysql";
require('dotenv').config();

const mysqlDB = mysql.createPool({
  connectionLimit: 10,

  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT),
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB
});
  console.log("🚀 ~ process.env.MYSQL_HOST:", process.env.MYSQL_HOST)
  console.log("🚀 ~ process.env.MYSQL_DB:", process.env.MYSQL_DB)



mysqlDB.getConnection((err: any, connection: any) => {
  if (err) {
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      console.log("Database connection was closed.");
    } else if (err.code === "ER_CON_COUNT_ERROR") {
      console.log("Database has too many connections.");
    } else if (err.code === "ECONNREFUSED") {
      console.log("Database connection was refused.");
    } else console.log("error");
  } else {
    console.log("Sucessfully connected to the mySQL database!");
  }

  if (connection) connection.release();
  return;
});

module.exports = mysqlDB;
