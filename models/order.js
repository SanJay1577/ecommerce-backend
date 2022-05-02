import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

const cartSchema = new mongoose.Schema({
  product: { type: ObjectId, ref: "product" },
  name: { type: String },
  count: { type: Number },
  price: { type: Number },
});

const Cart = mongoose.model("cart", cartSchema);

const orderSchema = new mongoose.Schema(
  {
    products: [cartSchema],
    transaction_id: {},
    name:{type: String},
    amount: { type: Number },
    address: { type: String }, 
    status: {
      type: String,
      default: "Ordered",
      enum: ["Cancelled", "Deliverd", "Shipping", "Processing", "Ordered"],
    },
    updated: { type: Date },
    user: { type: ObjectId, ref: "user" },
  },
  { timestamps: true }
);
const Order = mongoose.model("order", orderSchema);

export { Cart, Order };
