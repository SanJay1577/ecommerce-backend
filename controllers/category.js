import { Category } from "../models/category.js";

//params method middle ware for category

const getCategoryById = async (req, res, next, id) => {
  const category = await Category.findById(id);
  if (!category) 
  return res.status(400).json({ error: "No Category Found" });
  req.category =  category;
  next();
};

// get a category
const getCategory = (req, res) => {
  return res.json(req.category);
};

//get all category
const getAllCategory = async (req, res) => {
  const allCategory = await Category.find();
  if (!allCategory) return res.status(400).json({ error: "No Category Found" });
  return res.json(allCategory);
};

//creating a new category

const addNewCategory = async (req, res) => {
  const category = await new Category(req.body);
  if (!category)
    return res.status(400).json({ error: "cannot add a new category" });
  await category.save();
  return res.json(category);
};

//updating a new category

const updateCategory = async (req, res) => {
  const updatedCategory = await Category.findOneAndUpdate(
    { _id: req.category._id },
    { $set: req.body },
    { new: true }
  );
  if (!updatedCategory)
    return res.status(400).json({ error: "cannot update the category" });
  return res.json(updatedCategory);
};

const deleteCategory = async (req, res) => {
  const selectedCategory = await Category.findOneAndDelete({_id:req.category._id});
  if (!selectedCategory)
    return res.status(400).json({ error: "Delete Operation cannot be done" });
    return res.status(200).json({ message: "Sucessfully Deleted" });
};

//exporting all the controllers
export {
  getCategory,
  getAllCategory,
  getCategoryById,
  addNewCategory,
  updateCategory,
  deleteCategory,
};
