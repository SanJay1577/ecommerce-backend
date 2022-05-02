import { Product} from "../models/product.js";
import { Category } from "../models/category.js";
import formidable from "formidable";
import _ from "lodash";
import fs from "fs";

//paramater id middleware
const getProductById =  async (req, res, next, id) => {
  const product =  await Product.findById(id);
  if (!product) return res.status(400).json({ error: "No products found" });
  req.product = product;
  next();
};

//Operational methods of controller for products:
const addProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({ error: "Problem with adding the product" });
    }

    //desturcturing the filed objects

    const { name, description, price, category, stock } = fields;

    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({ error: "Please provide all details" });
    }

    let product = new Product(fields);

    //handling the fields

    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({ error: "File size too big" });
      }
      product.photo.data = fs.readFileSync(file.photo.filepath);
      product.photo.contentType = file.photo.type;
    }

    //handling error in saving the file in db
    if (!product)
      return res.status(400).send("Error uploading the product information");

    //saving the file in db
 
     product.save();


    return res.status(200).json(product)
  });


};

//List of all products
const getProduct = async (req, res) => {
const productId = await req.params.productId;
  const product = await Product.findOne({_id:productId});
   if(!product)
   return res.status(400).json({error:"Cannot fetch the product details"});
   return res.status(200).json(product)
};

//middleware for all photos of the produc for optimization purpose
const photoOfProduct = async (req, res, next) => {
  const productId = await req.params.productId;
  const product = await Product.findOne({_id:productId});
  if (product) {
    await res.set("Content-Type", product.photo.contentType);
    return res.send(product.photo.data);
  }
  next();
};

//edit and update a product imformation
const updateProduct =  async (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  let updatedproduct = await Product.findOne({_id:req.params.productId});
  

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.staus(400).json({ error: "Error in updating the product" });
    }
    // const { name, description, price, category, stock } = fields;

    // if (!name || !description || !price || !category || !stock) {
    //   return res.status(400).json({ error: "Please provide all details" });
    // }
   
    let product = updatedproduct;
   
    product = _.extend(product, fields, file);

    //handling the files
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({ error: "File size too big" });
      }
      product.photo.data = fs.readFileSync(file.photo.filepath);
      product.photo.contentType = file.photo.type;
    }

    //handling the product error
    if (!product)
      return res
        .status(400)
        .json({ error: "Error uploading the product information" });

    updatedproduct.save()

    //updating the product to the database
    return res.status(200).json(product);

  });
};

//delete a product
const deleteProduct = async (req, res) => {
const deletedProduct = await Product.findOneAndDelete({_id:req.params.productId})
  if (!deletedProduct)
    return res.status(400).json({ error: "Failed to delete the product" });
  return res.status(200).json({ message: "Suessfully deleted" });
};

// all product details...
const getAllProducts = async (req, res) => {
  let limit = (await req.query.limit) ? paresInt(req.query.limit) : 8;
  let sortBy = (await req.query.sortBy) ? req.query.sortBy : "category";

  let product = await Product.find()
    .select("-photo")
    .populate("category", "name _id")
    .sort([[sortBy, "asc"]])
    .limit(limit);

  if (!product) return res.status(400).json({ error: "No product available" });
  return res.status(200).json(product);
};

//all products in a specific category
const allProductsInCategory = async (req, res) => {
  await Product.distinct("category", {},  (err, category) => {
    if (err) {
      return res.status(400).json({ error: "No category found" });
    }
    return res.json(category);
  });
};

//Stocks updatation middleware
const updateStock = (req, res, next) => {
  let method = req.body.order.products.map((product) => {
    return {
      updateOne: {
        filter: { _id: product._id },
        update: { $inc: { stock: -product.count, sold: +product.count } },
      },
    };
  });
  Product.bulkWrite(method, {}, (err, products) => {
    if (err) {
      return res
        .status(400)
        .json({ error: "Updating method operation failed" });
    }
    next();
  });
};

//exporting the controllers
export {
  getProductById,
  addProduct,
  getAllProducts,
  getProduct,
  photoOfProduct,
  updateProduct,
  deleteProduct,
  allProductsInCategory,
  updateStock,
};
