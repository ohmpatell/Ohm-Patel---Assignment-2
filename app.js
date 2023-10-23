// OHM PATEL - 301277876

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const port = 5000;
const uri = "mongodb+srv://opatel11:patel123@mycluster.dwxtfon.mongodb.net/";

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.connection;

connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

// Schema

const product = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  quantity: Number,
  category: String,
});

const Product = mongoose.model("Product", product);

const category = new mongoose.Schema({
  name: String,
});

const Category = mongoose.model("Category", category);

// Routes

app.get("/", (req, res) => {
  res.send("{message: Welcome to DressStore Application}");
});

app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/products/:id", async (req, res) => {
  try {
    const products = await Product.findById(req.params.id);
    res.status(200).json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/products", async (req, res) => {
  const product = new Product(req.body);
  try {
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

app.put("/api/products/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete("/api/products/:id", async (req, res) => {
  try {
    const removedProduct = await Product.findByIdAndRemove(req.params.id);
    if (!removedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(removedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/products", async (req, res) => {
  try {
    await Product.deleteMany({});
    res.json({ message: "All products removed" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/products?name=kw", async (req, res) => {
  try {
    const keyword = req.params.keyword;
    const products = await Product.find({
      name: { $regex: keyword, $options: "i" },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
