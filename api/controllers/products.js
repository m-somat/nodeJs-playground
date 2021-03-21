const mongoose = require("mongoose");

const Product = require("../models/product.js");
const Order = require("../models/order.js");

const productsHost = "http://localhost:3000/products/";

function myError(res, msg, status) {
  res.status(status).json({
    error: msg,
  });
}

exports.products_get_all = (req, res) => {
  Product.find()
    .select("name price _id productImg")
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        products: docs.map((doc) => {
          return {
            name: doc.name,
            price: doc.price,
            id: doc._id,
            productImg: doc.productImg,
            url: productsHost + doc._id,
          };
        }),
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      myError(res, err, 500);
    });
};

exports.products_create_product = (req, res) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    publisher: req.userData.userId,
    productImg: req.file.path,
  });

  product
    .save()
    .then((result) => {
      res.status(201).json({
        msg: "Created product successfully",
        product: {
          name: result.name,
          price: result.price,
          publisher: req.userData.userId,
          id: result._id,
          productImg: req.file.path,
          url: productsHost + result._id,
        },
      });
    })
    .catch((err) => {
      myError(res, err, 500);
    });
};

exports.products_get_product = (req, res) => {
  const id = req.params.productId;

  Product.findById(id)
    .select("name price publisher _id productImg")
    .exec()
    .then((doc) => {
      if (doc) {
        res.status(200).json({
          product: doc,
          refererUrl: productsHost,
        });
      } else {
        return myError(res, "Product Not Found!", 404);
      }
    })
    .catch((err) => {
      myError(res, err, 500);
    });
};

exports.products_delete_product = (req, res) => {
  const id = req.params.productId;

  Product.findOneAndDelete({ _id: id, publisher: req.userData.userId })
    .exec()
    .then((result) => {
      if (!result) {
        return myError(res, "Product Not Found!", 404);
      } else {
        res.status(200).json({
          msg: "Deleted product: " + id,
          refererUrl: productsHost,
        });
        return Order.find({ product: id }).deleteMany();
      }
    })
    .catch((err) => {
      myError(res, err, 500);
    });
};

exports.products_update_product = (req, res) => {
  const id = req.params.productId;

  // update the changed property only
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }

  Product.updateOne(
    { _id: id, publisher: req.userData.userId },
    { $set: updateOps }
  )
    .exec()
    .then((result) => {
      res.status(200).json({
        msg: "product updated",
        product: result,
        url: productsHost + id,
      });
    })
    .catch((err) => {
      myError(res, err, 500);
    });
};
