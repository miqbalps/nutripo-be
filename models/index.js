import { Sequelize } from "sequelize";
import db from "../config/Database.js";

import Recipe from "./RecipeModel.js";
import Category from "./CategoryModel.js";

Recipe.belongsTo(Category, {
  foreignKey: "categoryId",
  as: "Category",
});
Category.hasMany(Recipe, {
  foreignKey: "categoryId",
});

(async () => {
  await db.sync();
})();

export { Recipe, Category };
