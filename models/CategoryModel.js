import { Sequelize } from "sequelize";
import db from "../config/Database.js";
const { DataTypes } = Sequelize;

const Category = db.define(
  "categories",
  {
    name: DataTypes.STRING,
    icon: DataTypes.STRING,
  },
  {
    freezeTableName: true,
  }
);

export default Category;
