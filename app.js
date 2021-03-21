// 200: (Accessed) The request has succeeded
// 201: (Created) the request has succeeded and has led to the creation of a resource
// 404: (Not found) the server can't find the requested resource
// 500: (Wrong resource) the server encountered an unexpected condition

const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

// connect to Mongoose driver to connect to MongoDB
mongoose.connect(
  "mongodb+srv://" +
    process.env.MONGO_ATLAS_user +
    ":" +
    process.env.MONGO_ATLAS_PW +
    "@" +
    process.env.MONGO_ATLAS_cluster +
    ".mongodb.net/playGroundDatabase?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
mongoose.set("useCreateIndex", true);

// middlewares
app.use("/uploads", express.static("uploads"));
app.use(morgan("dev"));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CORS error handling
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, PATCH");
    return res.status(200).json({});
  }
  next();
});

// user handlers
const productRoutes = require("./api/routes/products.js");
const orderRoutes = require("./api/routes/orders.js");
const userRoutes = require("./api/routes/user.js");

app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/user", userRoutes);

// error handlers
app.use((req, res, next) => {
  const error = new Error("Entry Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      msg: error.message,
    },
  });
});

module.exports = app;
