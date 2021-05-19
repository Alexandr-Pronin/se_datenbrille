var path = require("path");

module.exports = {
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "databuddy_liquibase",
  password: "liquibasepw",
  database: "databuddy",
  synchronize: false,
  logging: false,
  entities: [path.join(__dirname, "/target/entities/*.js")],
};
