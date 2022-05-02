import express from "express";
import { signin, singout, singup } from "../controllers/authentication.js";
import { User } from "../models/user.js";

const router = express.Router();

router.post("/signup", singup);

router.post("/signin", signin);

router.get("/signout", singout);

router.delete("/alluser/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findOneAndDelete({ _id: id });
    if (!user) return res.status(400).send({ error: "error" });
    return res.status(200).json({ message: "Deleted succesfuly" });
  } catch (error) {
    console.log(error);
  }
});

export const authRouter = router;
