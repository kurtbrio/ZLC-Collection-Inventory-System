const Product = require("../models/product");
const fs = require("fs");

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();

    return res.status(200).json({ products });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const { id } = await req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.json({ error: "Product not found" });
    }

    return res.status(200).json({ product });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};

exports.addProduct = async (req, res) => {
  const { name, price, category, type, sizes, gender } = await req.body;
  const imageUrl = req.file ? req.file.path : undefined;
  console.log(req.body);
  const cleanupImage = (image) => {
    if (image) {
      fs.unlinkSync(image);
    }
  };

  try {
    if (!name || !price || !category || !type || !sizes || !gender) {
      cleanupImage(imageUrl);
      return res.json({ error: "All fields must be filled" });
    }

    if (price < 1) {
      cleanupImage(imageUrl);
      return res.json({ error: "Price  must be at least 1" });
    }

    const productExist = await Product.findOne({ name });

    if (productExist) {
      cleanupImage(imageUrl);
      return res.json({ error: "Product already exists" });
    }

    const newProduct = new Product({
      name,
      price,
      category,
      type,
      sizes: JSON.parse(sizes),
      gender,
      imageUrl: imageUrl === undefined ? undefined : req.file.filename,
    });

    const savedProduct = await newProduct.save();

    return res
      .status(200)
      .json({ savedProduct, success: "Add product success" });
  } catch (error) {
    cleanupImage(imageUrl);
    return res.status(500).json({ error: "Server error" });
  }
};

exports.updateProduct = async (req, res) => {
  const productId = await req.params.id;
  const { name, price, category, type, sizes, gender } = await req.body;
  const newImageUrl = (await req.file) ? req.file.path : undefined;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (product.imageUrl && newImageUrl && product.imageUrl !== newImageUrl) {
      const oldImagePath = `public/images/${product.imageUrl}`;
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    product.name = name !== undefined ? name : product.name;
    product.price = price !== undefined ? price : product.price;
    product.category = category !== undefined ? category : product.category;
    product.type = type !== undefined ? type : product.type;
    product.gender = gender !== undefined ? gender : product.gender;

    if (sizes) {
      product.sizes = JSON.parse(sizes);
    }

    if (newImageUrl) {
      product.imageUrl = req.file.filename;
    }

    const updatedProduct = await product.save();

    return res.status(200).json({ message: "Success" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

exports.deleteProduct = async (req, res) => {
  const productId = req.params.id;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.json({ error: "Product not found" });
    }

    if (product.imageUrl) {
      fs.unlinkSync(`public/images/${product.imageUrl}`);
    }

    const deletedProduct = await Product.findByIdAndDelete(productId);

    return res
      .status(200)
      .json({ success: `${deletedProduct._id} deleted successfully` });
  } catch (error) {
    return res.status(500).json(error);
  }
};
