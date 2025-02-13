const mongoose = require("mongoose");
const Sales = require("../models/sales");
const Product = require("../models/product");

exports.getDailyReport = async (req, res) => {
  const { year, month, day } = req.body;

  try {
    const start = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
    const end = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));

    const dailyData = await Sales.find({
      date: { $gte: start, $lte: end },
    }).populate("product");

    const totalSale = dailyData.reduce(
      (total, sale) => total + sale.totalPrice,
      0
    );

    const saleByType = {};

    dailyData.map((sale) => {
      const { type } = sale.product;

      if (!saleByType[type]) {
        saleByType[type] = 0;
      }

      saleByType[type] += sale.totalPrice;
    });

    return res.status(200).json({ totalSale, saleByType });
  } catch (error) {
    return res.status(400).json({ error: "Server Error" });
  }
};

exports.getMonthlyReport = async (req, res) => {
  const { year, month } = req.body;
  const reports = [];

  try {
    const lastDayOfMonth = new Date(Date.UTC(year, month, 0));

    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      const start = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
      const end = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));

      const data = await Sales.find({
        date: { $gte: start, $lte: end },
      }).populate("product");

      const dailyReport = { totalSale: 0, salesByType: {} };

      data.map((sale) => {
        const { type } = sale.product;

        if (!dailyReport.salesByType[type]) {
          dailyReport.salesByType[type] = { totalPrice: 0, totalQuantity: 0 };
        }

        dailyReport.salesByType[type].totalPrice += sale.totalPrice;
        dailyReport.salesByType[type].totalQuantity += sale.sizes.reduce(
          (sum, size) => sum + size.quantity,
          0
        );

        dailyReport.totalSale += sale.totalPrice;
      });

      reports.push({
        date: start.toISOString().split("T")[0],
        totalSale: dailyReport.totalSale,
        salesByType: dailyReport.salesByType,
      });
    }

    return res.status(200).json({ reports });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: "Server Error" });
  }
};

exports.getYearlyReport = async (req, res) => {};

exports.getTopSellers = async (req, res) => {
  const { year, month, day } = req.body;

  try {
    let start, end;

    if (!month && !day) {
      start = new Date(Date.UTC(year, 0, 1, 0, 0, 0, 0));
      end = new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999));
    } else if (!day) {
      start = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
      end = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));
    } else {
      start = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
      end = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));
    }

    const productSales = [];

    const data = await Sales.find({
      date: { $gte: start, $lte: end },
    }).populate("product");

    data.forEach((sale) => {
      const quantitySold = sale.sizes.reduce((sum, size) => {
        return sum + size.quantity;
      }, 0);

      const existingProduct = productSales.find(
        (product) => product.productName === sale.productName
      );

      if (existingProduct) {
        existingProduct.quantitySold += quantitySold;
      } else {
        productSales.push({
          id: sale.product,
          productName: sale.productName,
          quantitySold,
          imageUrl: sale.product.imageUrl,
        });
      }
    });

    productSales.sort((a, b) => b.quantitySold - a.quantitySold);

    const topSellers = productSales.slice(0, 5);
    return res.status(200).json({ topSellers });
  } catch (error) {
    return res.status(400).json({ error: "Server Error" });
  }
};
