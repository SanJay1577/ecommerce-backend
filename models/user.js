import mongoose from "mongoose";
import joi from "joi";
import passwordComplexity from "joi-password-complexity";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 32,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: Number,
      default: 0,
    },
    purchases: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);

const validate = (data) => {
  const schema = joi.object({
    name: joi.string().required().label("Name"),
    email: joi.string().email().required(),
    password: passwordComplexity().required(),
  });

  return schema.validate(data);
};

export { User, validate };
