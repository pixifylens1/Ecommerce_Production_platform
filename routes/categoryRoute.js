import express from "express";
import { isadmin, RequiredSignIn } from "../middlewares/authMiddleware.js";
import { categoryController, createcategoryController, deletecategoryController, singlecategoryController, updatecategoryController } from "../controllers/categoryController.js";

const router = express.Router();
// create Category
router.post("/create-category", RequiredSignIn, isadmin, createcategoryController);
//Update Category
router.put("/update-category/:id", RequiredSignIn, isadmin, updatecategoryController);
//GET All Category
router.get("/get-category",categoryController);
//Get Single Category
router.get("/single-category/:slug",singlecategoryController);
//Delete Category
router.delete("/delete-category/:id", RequiredSignIn, isadmin, deletecategoryController);

export default router;
