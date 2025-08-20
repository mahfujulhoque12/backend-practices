const express = require("express");
const mongoose = require("mongoose");

const app = express();

const port = 3002;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// create a schema
const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// create a model
const Product = mongoose.model("products", productSchema);

app.get("/", (req, res) => {
  res.send("wellcome to get request");
});

// create data start
app.post("/products", async (req, res) => {
  try {
    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description;

    const newProduct = new Product({
      title,
      price,
      description,
    });
    const productData = await newProduct.save();

    res.status(201).send(productData);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// create data end

// get products start
app.get("/products", async (req, res) => {
  const price = req.query.price;
  let products;
  try {
    if (price) {
      products = await Product.find({ price: { $lt: price } });
    } else {
      products = await Product.find();
    }
    if (products) {
      res.status(200).send(products);
    } else {
      res.status(404).send({ message: "product not found" });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});
// get products end

// get speacific id start
app.get("/products/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findOne({ _id: id }, { title: 1, _id: 0 });
    if (product) {
      res.status(200).send({
        success: true,
        message: "return single produt",
        data: product,
      });
    } else {
      res.status(404).send({
        message: "Product not found",
      });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});
// get speacific id end

mongoose
  .connect("mongodb://127.0.0.1:27017/testProductDb")
  .then(() => console.log("db is conected"))
  .catch((error) => {
    console.log("db is not connected");
    console.log(error);
    process.exit(1);
  });

app.listen(port, () => {
  console.log(`server is running at ${port}`);
});
