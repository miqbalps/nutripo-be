import express from "express";
import multer from "multer";

import {
  getRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} from "../controllers/RecipeController.js";

const router = express.Router();
const upload = multer();

router.get("/recipes", getRecipes);
router.get("/recipes/:id", getRecipeById);
router.post("/recipes", upload.single("image"), createRecipe);
router.patch("/recipes/:id", upload.single("image"), updateRecipe);
router.delete("/recipes/:id", deleteRecipe);
export default router;
