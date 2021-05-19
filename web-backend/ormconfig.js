var path = require("path");

module.exports = {
  type: "mysql",
  host: process.env.DB_HOST,
  port: 3306,
  username: process.env.DB_USER,
  password: process.env.DB_PW,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: false,
  entities: [path.join(__dirname, "/target/entities/*.js")],
};

/*var path = require("path");

module.exports = {
  type: "mysql",
  host: "37.17.224.131",
  port: 3306,
  username: "web190_5",
  password: "liquibasepw",
  database: "web190_db5",
  synchronize: false,
  logging: false,
  entities: [path.join(__dirname, "/target/entities/*.js")],
};
*/
