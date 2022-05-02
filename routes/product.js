import express from "express";
import {
  getProductById,
  addProduct,
  getProduct,
  photoOfProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  allProductsInCategory,
} from "../controllers/product.js";
import { paramsId } from "../controllers/userControl.js";
import {
  isSignedIn,
  isAuthenticated,
  isAdmin,
} from "../controllers/authentication.js";

//intializing the routes
const router = express.Router();

//initializing the parameters
router.param("userId", paramsId);
router.param("/productId", getProductById);

//Product method routes:
router.post(
  "/product/add/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  addProduct
);

//Get Product details and photos
router.get("/product/:productId", getProduct);
router.get("/product/photo/:productId", photoOfProduct);

//edit or updating the product route
router.put(
  "/product/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateProduct
);

//delete a product from the category
router.delete(
  "/product/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  deleteProduct
);

//list all the products for the user
router.get("/products", getAllProducts);
router.get("/products/categories", allProductsInCategory);

//exporting the router
export const productRouter = router;
