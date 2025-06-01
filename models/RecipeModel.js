import { Sequelize } from "sequelize";
import db from "../config/Database.js";
const { DataTypes } = Sequelize;

const Recipe = db.define(
  "recipes",
  {
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    prepTime: DataTypes.INTEGER,
    cookTime: DataTypes.INTEGER,
    difficulty: DataTypes.STRING,
    ingredients: DataTypes.STRING,
    steps: DataTypes.STRING,
    nutrition: DataTypes.JSON,
    bookmark: DataTypes.INTEGER,
    image: DataTypes.STRING,
    categoryId: {
      // Add foreign key field
      type: DataTypes.INTEGER,
      references: {
        model: "categories",
        key: "id",
      },
    },
  },
  {
    freezeTableName: true,
  }
);

export default Recipe;
