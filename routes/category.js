import express from "express";
import {
  getCategoryById,
  addNewCategory,
  updateCategory,
  getCategory,
  getAllCategory,
  deleteCategory,
} from "../controllers/category.js";
import { paramsId } from "../controllers/userControl.js";
import {
  isSignedIn,
  isAuthenticated,
  isAdmin,
} from "../controllers/authentication.js";

const router = express.Router();

//Router Params :
router.param("userId", paramsId);
router.param("categoryId", getCategoryById);

//cartegory method routes.

//Details of the category
router.get("/category/:categoryId", getCategory);
router.get("/categories", getAllCategory);

//Add a new Category by the admin.
router.post(
  "/category/add/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  addNewCategory
);

//edit or update a category name
router.put(
  "/category/:categoryId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,  
  updateCategory
);

//delete a category
router.delete(
  "/category/:categoryId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  deleteCategory
);


export const categoryRouter = router 