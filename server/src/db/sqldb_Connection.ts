import mysql from "mysql2";

export const mysqlConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "rishavdatabase887",
  database: "dummy_project",
});
