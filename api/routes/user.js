const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const checkAuth = require("../middleware/check-auth.js");

function myError(res, msg, status) {
  res.status(status).json({
    error: msg,
  });
}

const User = require("../models/user.js");

router.post("/signup", (req, res) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        return myError(res, "email already signed up", 409);
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return myError(res, err, 500);
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
            });
            user
              .save()
              .then((result) => {
                res.status(201).json({
                  msg: "User created",
                });
              })
              .catch((err) => {
                myError(res, err, 500);
              });
          }
        });
      }
    })
    .catch();
});

router.post("/login", (req, res) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return myError(res, "Auth failed", 401);
      } else {
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
          if (err) {
            return myError(res, "Auth failed", 401);
          }
          if (result) {
            const token = jwt.sign(
              {
                userId: user[0]._id,
              },
              process.env.JWT_KEY,
              {
                expiresIn: "12h",
              }
            );
            return res.status(200).json({
              token: token,
              msg: "Auth successful",
            });
          }
          return myError(res, "Auth failed", 401);
        });
      }
    })
    .catch((err) => myError(res, err, 500));
});

router.post("/logout", checkAuth, (req, res) => {
  User.find({ _id: req.userData.userId })
    .exec()
    .then((user) => {
      const token = jwt.sign(
        {
          userId: user[0]._id,
        },
        process.env.JWT_KEY,
        {
          expiresIn: "1",
        }
      );
      res.set("Authorization", "Bearer " + token).end();
    })
    .catch((err) => myError(res, err, 500));
});

router.delete("/:userId", checkAuth, (req, res) => {
  const id = req.params.userId;
  User.remove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({
        msg: "User deleted",
      });
    })
    .catch((err) => {
      myError(res, err, 500);
    });
});

module.exports = router;
