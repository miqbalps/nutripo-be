import path from "path";
import fs from "fs";
import { Recipe, Category } from "../models/index.js";

export const getRecipes = async (req, res) => {
  try {
    const response = await Recipe.findAll({
      include: {
        model: Category,
        as: "Category",
      },
    });
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const getRecipeById = async (req, res) => {
  try {
    const response = await Recipe.findOne({
      where: {
        id: req.params.id,
      },
      include: {
        model: Category,
        as: "Category",
      },
    });
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
};

const handleFileUpload = (file, recipeId) => {
  if (!file) return null;

  // Create uploads directory if it doesn't exist
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Generate unique filename
  const ext = path.extname(file.originalname);
  const filename = `${recipeId}${ext}`;
  const filePath = path.join(uploadDir, filename);

  // Save file
  fs.writeFileSync(filePath, file.buffer);

  // Return path yang konsisten dengan static serving
  return `/uploads/${filename}`;
};

export const createRecipe = async (req, res) => {
  try {
    let nutritionData = null;
    if (req.body.nutrition) {
      try {
        nutritionData = JSON.parse(req.body.nutrition);
      } catch (error) {
        console.log("Error parsing nutrition data:", error);
        nutritionData = null;
      }
    }

    // First create the recipe without image to get the ID
    const recipe = await Recipe.create({
      title: req.body.title,
      description: req.body.description,
      prepTime: req.body.prepTime,
      cookTime: req.body.cookTime,
      difficulty: req.body.difficulty,
      categoryId: req.body.categoryId,
      ingredients: req.body.ingredients,
      steps: req.body.steps,
      nutrition: nutritionData,
      image: null, // Will be updated after file upload
    });

    // Handle image upload if exists
    let imagePath = null;
    if (req.file) {
      imagePath = handleFileUpload(req.file, recipe.id);
      await recipe.update({ image: imagePath });
    }

    res.status(201).json({
      msg: "Recipe created",
      data: {
        ...recipe.toJSON(),
        image: imagePath,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

export const updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByPk(req.params.id);
    if (!recipe) {
      return res.status(404).json({ msg: "Recipe not found" });
    }

    // Parse nutrition data if exists
    let nutritionData = recipe.nutrition; // Keep existing if not provided
    if (req.body.nutrition) {
      try {
        nutritionData = JSON.parse(req.body.nutrition);
      } catch (error) {
        console.log("Error parsing nutrition data:", error);
        // Keep existing nutrition data if parsing fails
      }
    }

    // Handle image upload if exists
    let imagePath = recipe.image;
    if (req.file) {
      // Delete old image if exists
      if (imagePath) {
        const oldImagePath = path.join(process.cwd(), "public", imagePath);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      imagePath = handleFileUpload(req.file, recipe.id);
    }

    await recipe.update({
      title: req.body.title,
      description: req.body.description,
      prepTime: req.body.prepTime,
      cookTime: req.body.cookTime,
      difficulty: req.body.difficulty,
      categoryId: req.body.categoryId,
      ingredients: req.body.ingredients,
      steps: req.body.steps,
      nutrition: nutritionData,
      image: imagePath,
    });

    res.status(200).json({
      msg: "Recipe updated",
      data: recipe,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

export const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByPk(req.params.id);
    if (!recipe) {
      return res.status(404).json({ msg: "Recipe not found" });
    }

    // Delete associated image if exists
    if (recipe.image) {
      const imagePath = path.join(process.cwd(), "public", recipe.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await recipe.destroy();
    res.status(200).json({ msg: "Recipe deleted" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};
