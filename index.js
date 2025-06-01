import express from "express";
import cors from "cors";
import RecipeRoute from "./routes/RecipeRoute.js";
import CategoryRoute from "./routes/CategoryRoute.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(CategoryRoute);
app.use(RecipeRoute);
app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));
app.listen(5000, () => console.log("server up and running…"));
