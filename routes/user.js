import express from "express";
import {
  getUserInfo,
  paramsId,
  updateUserInfo,
  userPurchaseList,
} from "../controllers/userControl.js";
import { isSignedIn, isAuthenticated } from "../controllers/authentication.js";
const router = express.Router();

//Router params
router.param("userId", paramsId);

//User control routes
router.get("/user/:userId", isSignedIn, isAuthenticated, getUserInfo);
router.put("/user/:userId", isSignedIn, isAuthenticated, updateUserInfo);

//Product and purchase linked to a user controls

router.get(
  "/orders/user/:userId",
  isSignedIn,
  isAuthenticated,
  userPurchaseList
);

export const userRouter = router;
