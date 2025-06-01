import { Sequelize } from "sequelize";

const db = new Sequelize("db_recipo", "root", "", {
  host: "localhost",
  dialect: "mysql",
});
export default db;
