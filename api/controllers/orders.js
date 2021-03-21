const mongoose = require("mongoose");

const Order = require("../models/order.js");
const Product = require("../models/product.js");

const ordersHost = "http://localhost:3000/orders/";

function myError(res, msg, status) {
  res.status(status).json({
    error: msg,
  });
}

exports.orders_get_all = (req, res) => {
  Order.find({ user: req.userData.userId })
    .select("product quantity _id")
    .populate("product", "name productImg")
    .exec()
    .then((docs) => {
      res.status(200).json({
        count: docs.length,
        orders: docs.map((doc) => {
          return {
            orderId: doc._id,
            product: doc.product,
            user: req.userData.userId,
            quantity: doc.quantity,
            url: ordersHost + doc._id,
          };
        }),
      });
    })
    .catch((err) => {
      myError(res, err, 500);
    });
};

exports.orders_create_order = (req, res) => {
  Product.findById(req.body.productId)
    .then((product) => {
      console.log(product);
      if (!product) {
        return myError(res, "Product Not Found!", 404);
      }
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        user: req.userData.userId,
        product: req.body.productId,
        quantity: req.body.quantity,
      });
      return order.save();
    })
    .then((result) => {
      res.status(201).json({
        msg: "Order stored",
        order: {
          _id: result._id,
          user: req.userData.userId,
          product: result.product,
          quantity: result.quantity,
        },
        url: ordersHost + result._id,
      });
    })
    .catch((err) => {
      myError(res, err, 500);
    });
};

exports.orders_get_order = (req, res) => {
  const id = req.params.orderId;

  Order.find({ _id: id, user: req.userData.userId })
    .select("product quantity _id user referer")
    .populate("product", "name price productImg")
    .exec()
    .then((order) => {
      if (order.length < 1) {
        return myError(res, "Order Not Found!", 404);
      } else {
        return res.status(200).json({
          order: order,
          referer: ordersHost,
        });
      }
    })
    .catch((err) => {
      myError(res, err, 500);
    });
};

exports.orders_delete_order = (req, res) => {
  const id = req.params.orderId;
  Order.findOneAndDelete({ _id: id, user: req.userData.userId })
    .exec()
    .then((result) => {
      if (!result) {
        return myError(res, "Order Not Found!", 404);
      } else {
        res.status(200).json({
          msg: "Order Deleted",
        });
      }
    })
    .catch((err) => {
      return myError(res, err, 500);
    });
};
