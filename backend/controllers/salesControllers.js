const Product = require("../models/product");
const Sales = require("../models/sales");

exports.getSales = async (req, res) => {
  try {
    const sales = await Sales.find();

    return res.status(200).json({ sales });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server Error" });
  }
};

exports.getSale = async (req, res) => {
  try {
    const { id } = req.params;
    const sale = await Sales.findById(id);

    if (!sale) {
      return res.json({ error: "Sale not found" });
    }

    return res.status(200).json({ sale });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};

exports.getProductSales = async (req, res) => {
  const { id } = req.params;

  try {
    const sales = Sales.find({ product: id });

    if (!sales) {
      return res.json({ error: "Sale not found" });
    }

    return res.status(200).json({ sales });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};

exports.addSale = async (req, res) => {
  try {
    const { productId, sizes, totalPrice, date } = req.body;

    if (!productId || !sizes || !totalPrice || !date) {
      return res.json({ error: "All fields must be filled" });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.json({ error: "Product not found" });
    }

    let allSizeOutOfStock = true;

    for (const sizeObj of sizes) {
      const size = sizeObj.size;
      const quantity = sizeObj.quantity;

      const productSize = product.sizes.find((i) => i.size === size);

      if (!productSize) {
        return res.json({ error: "Invalid size specified" });
      }

      if (productSize.quantity < quantity) {
        return res.json({
          error: `Insufficient stock available for size: ${size}`,
        });
      }

      if (productSize.quantity > 0) {
        allSizeOutOfStock = false;
      }

      productSize.quantity -= quantity;
    }

    if (allSizeOutOfStock) {
      return res.json({ error: "All sizes are out of stock" });
    }

    await product.save();

    const newSale = new Sales({
      product: productId,
      productName: product.name,
      sizes,
      totalPrice,
      date,
    });

    const savedSale = await newSale.save();

    return res
      .status(200)
      .json({ success: "Sale successfully added", savedSale });
  } catch (error) {
    return res.status(500).json({ error: "Server Error" });
  }
};

exports.deleteSale = async (req, res) => {
  try {
    const { id } = req.params;

    const sale = await Sales.findByIdAndDelete(id);

    if (!sale) {
      return res.json({ error: "Sale not found" });
    }

    const product = await Product.findById(sale.product);

    if (!product) {
      return res.json({ error: "Product not found" });
    }

    for (const sizeObj of sale.sizes) {
      const size = sizeObj.size;
      const quantity = sizeObj.quantity;

      const productSize = product.sizes.find((i) => i.size === size);

      if (productSize) {
        productSize.quantity += quantity;
      } else {
        return res.json({ error: `Cannot find ${size} in product` });
      }
    }

    await product.save();

    return res.status(200).json({
      success: "Sale successfully deleted and stock has been updated",
    });
  } catch (error) {
    return res.status(500).json({ error: "Server Error" });
  }
};
