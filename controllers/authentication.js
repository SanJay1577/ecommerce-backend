import { User, validate } from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import expressJwt from "express-jwt";
import joi from "joi"; 

const validateLogin = (data) => {
  const Schema = joi.object({
    email: joi.string().email().required().label("Email"),
    password: joi.string().required().label("Password"),
  });
  return Schema.validate(data);
};

const singup = async (req, res) => {
  try {
    //validating the input field.
    const { error } = validate(req.body);
    if (error) return res.status(400).send({ error: error.details[0].message });
    //validating wheather the user is already available
    let user = await User.findOne({ email: req.body.email });
    if (user)
      return res.status(200).send({ error: "User is already registered" });
    //password hashing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    //adding the new user to the database
    user = await new User({ ...req.body, password: hashedPassword }).save();
    return res.status(200).send({ message: "User is registered" });
  } catch (error) {
    //checking for errror
    console.log(error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

const signin = async (req, res) => {
  try {
    const { error } = validateLogin(req.body);
    if (error) return res.status(400).send({ error: error.details[0].message });
    //checking wheather the user exist
    const user = await User.findOne({ email: req.body.email });
    //if user is not in the database
    if (!user) return res.status(400).send({ error: "Invalid authorization" });
    //comparing the hashed password
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    //if not a valid password
    if (!validPassword)
      return res.status(400).send({ error: "Invalid Password" });
    const authtoken = jwt.sign(
      { email: user.email, id: user._id },
      process.env.SECRET_KEY
    );
    //passing the token to cokkies.
    await res.cookie("token", authtoken, { expire: new Date() + 9999 });
    //user details,
    //Object desturcturing
    const { _id, name, email, role } = await user;
    return res
      .status(200)
      .send({ token: authtoken, user: { _id, name, email, role } });
  } catch (error) {
    //checking for error
    console.log(error);
    return res.status(500).send({ error: "Internal server error" });
  }
};

const singout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "User signout sucessfully",
  });
};
//middle wares

const isSignedIn = expressJwt({
  secret: "i'mLearningTocodeMyslef",
  userProperty: "auth",
  algorithms: ["HS256"],
});

const isAuthenticated = async (req, res, next) => {
  let checker =
 await req.profile && req.auth && req.profile._id == req.auth.id;
  if (!checker) return res.status(403).json({ error: "Not Authenticated" });
  next();
};

const isAdmin = async (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({ error: "You are not Admin" });
  }
  next();
};

export { singup, signin, singout, isSignedIn, isAuthenticated, isAdmin };
