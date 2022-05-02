import { User } from "../models/user.js";
import { Order } from "../models/order.js";

//initializing the paramaters

const paramsId = async (req, res, next, id) => {
  const user = await User.findById(id);
  if (!user) return res.status(400).json({ error: "No user was found" });
  req.profile = user;
  next();
};

//get user by the params id
const getUserInfo = (req, res) => {
  req.profile.password = undefined;
  return res.json(req.profile);
};

//Updation method

const updateUserInfo = async (req, res) => {
  const user = await User.findByIdAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true }
  );
  if (!user) return res.status(400).json({ error: "Not authorised to change" });
  user.password = undefined;
  return res.json(user);
};
//Orderlist method
const userPurchaseList = async (req, res) => {
  const order = await Order.find({ user: req.profile._id }).populate(
    "user",
    "_id name"
  );
  if (!order)
    return res.status(400).json({ error: "No Orders in this account" });
  return res.json(order);
};

//Order to the Purchase List
const orderToPurchaseList = (req, res, next) => {
  let purchase = [];
  req.body.order.products.forEach((product) => {
    purchase.push({
      _id: product._id,
      name: product.name,
      description: product.description,
      category: product.category,
      quantity: product.quantity,
      amount: req.body.order.amount,
      transaction_id: req.body.order.transaction_id,
    });
  });
  //add to the database
  const user = User.findOneAndUpdate(
    { _id: req.profile._id },
    { $push: { purchases: purchase } },
    { new: true }
  );
  if (!user)
    return res.status(400).json({ error: "Sorry cannot add purchase list" });
  next();
};
//exporting the controllers 
export {
  getUserInfo,
  paramsId,
  updateUserInfo,
  userPurchaseList,
  orderToPurchaseList,
};
