import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema;
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const Category = mongoose.model("category", categorySchema);

export { Category };
