import { Order, Cart } from "../models/order.js";


//params id middleware for orders
const getOrderById = async (req, res, next, id) => {
  const order = await Order.findById(id);
  if (!order) return res.status(400).json({ error: "No Order Details found" });
  req.order = order;
  next();
};

//placing a new order by the user
const addNewOrder = async (req, res) => {

  const order = await new Order({...req.body, user:req.params.userId}).save()
  //error handling.
  if (!order)
    return res.status(400).json({ error: "Failed to place your order" });
  //returing the order details.
  return res.status(200).json(order);
};

//all order details controller
const getAllOrders = async (req, res) => {
  const order = await Order.find().populate("user", "_id name");
  //error in finding the order or no orders
  if (!order) return res.status(400).json({ error: "No Orders Found" });
  //returing all the order details
  return res.status(200).json(order);
};

//Status of the placed order
const getOrderStatus = async (req, res) => {
  await res.json(Order.schema.path("status").enumValues);
};



//updating the current status of the order
const updateOrderStatus = async (req, res) => {
  try{
  const order = await Order.updateOne(
    { _id: req.params.orderId },
    { $set: { status: req.body.status } }
  );
  if (!order)
    return res.status(400).json({ error: "Cannot update the order Status" });
  //returning the updated order
  return res.json(order);
  }
  catch(error){
    console.log(error)
  }
};

//exporting eth controllers of Order deatils
export {
  getOrderById,
  addNewOrder,
  getAllOrders,
  getOrderStatus,
  updateOrderStatus,

};
