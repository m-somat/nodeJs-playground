const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// connect to Mongoose driver to connect to MongoDB
mongoose.connect(
	'mongodb+srv://' +
	process.env.MONGO_ATLAS_user + ':' +
	process.env.MONGO_ATLAS_PW +
	'@' + 
	process.env.MONGO_ATLAS_cluster +
	'.mongodb.net/playGroundDatabase?retryWrites=true&w=majority',
	{
		useNewUrlParser: true,
		useUnifiedTopology: true
	}
);

// middlewares
app.use('/uploads', express.static('uploads'))
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// CORS error handling
app.use((req,res,next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
	"Access-Control-Allow-Headers",
	"Origin, X-Requested-With, Content-Type, Accept, Authorization"
	);
	if (req.method === 'OPTIONS') {
	res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, PATCH");
	return res.status(200).json({});
	}
	next();
})

// user handlers
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

// error handlers
app.use((req,res,next) => {
	const error = new Error('Entry Not Found');
	error.status = 404;
	next(error);
})

app.use((error,req,res,next) => {
	res.status(error.status || 500);
	res.json({
		"error": {
			"msg": error.message
		}
	})
})

module.exports = app;