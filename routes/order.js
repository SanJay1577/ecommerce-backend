import express from "express";
import { paramsId, orderToPurchaseList } from "../controllers/userControl.js";
import {
  addNewOrder,
  getAllOrders,
  getOrderById,
  getOrderStatus,
  updateOrderStatus,
} from "../controllers/order.js";
import {
  isSignedIn,
  isAuthenticated,
  isAdmin,
} from "../controllers/authentication.js";
import { updateStock } from "../controllers/product.js";

//router setup
const router = express.Router();

//params routers
router.param("userId", paramsId);
router.param("orderId", getOrderById);

//order control methodds router
//adding a new order
router.post(
  "/order/add/:userId",
  isSignedIn,
  isAuthenticated,
  addNewOrder
);

//Order details reading all the order details
router.get(
  "/order/all/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  getAllOrders,
  getOrderStatus
);

router.get(
  "/orders/all",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  getAllOrders,
);

//Current Status of the order
router.get(
  "/order/status/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  getOrderStatus
);

//updating the order status router
router.put(
  "/order/:orderId/status/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateOrderStatus 
);
//exporting the routes
export const orderRouter = router;
