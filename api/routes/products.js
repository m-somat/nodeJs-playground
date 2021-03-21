// 200: (Accessed) The request has succeeded
// 201: (Created) the request has succeeded and has led to the creation of a resource
// 404: (Not found) the server can't find the requested resource
// 500: (Wrong resource) the server encountered an unexpected condition

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

const Product = require('../models/product');
const Order = require('../models/order');

const storage = multer.diskStorage({
	destination: function(req, file, cb){
		cb(null, './uploads/');
	},
	filename: function(req,file,cb){
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
		cb(null, uniqueSuffix +'-' + file.originalname)
	}
});

const fileFilter = (req,file,cb) => {
	if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
		cb(null, true) //store the file
	} else { //reject the file
		cb(new Error('File is not accepted'), false)
	}
}

const upload = multer({
	"storage": storage,
	"limits": {
		"fileSize": 1024 * 1024 * 5 //5 MBs size limit
	},
	"fileFilter": fileFilter
});

function myError(res,msg,status){
	res.status(status).json({
	  	"error": msg
	})
}

// Products handler
router.get('/', (req,res,next) => {
	Product
	  .find()
	  .select("name price _id productImg")
	  .exec()
	  .then(docs => {
	  	const response = {
	  		"count": docs.length,
	  		"products":  docs.map(doc => {
	  			return {
	  				"name": doc.name,
	  				"price": doc.price,
	  				"id": doc._id,
	  				"productImg": doc.productImg,
	  				"url": 'http://localhost:3000/products/' + doc._id
	  			}
	  		})
	  	}
	  	res.status(200).json(response);
	  })
	  .catch(err => {myError(res,err,500)})
})

router.post('/', upload.single('productImg'), (req,res,next) => {
	console.log(req.file);
	const product = new Product({
		"_id": new mongoose.Types.ObjectId(),
		"name": req.body.name,
		"price": req.body.price,
		"productImg": req.file.path
	})

	product
	  .save()
	  .then(result => {
		res.status(201).json({
			"msg": 'Created product successfully',
			"product": {
				"name": result.name,
				"price": result.price,
				"id": result._id,
				"productImg": req.file.path,
				"url": 'http://localhost:3000/products/' + result._id
			}
		})
	  })
	  .catch(err => {myError(res,err,500)})
});


// Singular Product handler
router.get('/:productId', (req,res,next) => {
	const id = req.params.productId;

	Product
	  .findById(id)
	  .select("name price _id productImg")
	  .exec()
	  .then(doc => {
	  	if (doc){
	  		res.status(200).json({
	  			"product": doc,
	  			"refererUrl": "http://localhost:3000/products"
	  		});
	  	} else{
	  		myError(res,"Product Not Found!",404)
	  	}
	  })
	  .catch(err => {myError(res,err,500)})
});

router.delete('/:productId', (req,res,next) => {
	const id = req.params.productId;

	Product
	  .findOneAndDelete({"_id": id})
	  .exec()
	  .then(result => {
	  	res.status(200).json({
	  		"msg": "Deleted product: " + id,
	  		"refererUrl": "http://localhost:3000/products"
	  	});
	  	return Order.find({"product": id}).deleteMany()
	  })
	  .then(result => {
	  	res.status().json({
	  		"msg": "Deleted associated orders"
	  	});
	  })
	  .catch(err => {myError(res,err,500)})
});

router.patch('/:productId', (req,res,next) => {
	const id = req.params.productId;

	// update the changed property only
	const updateOps = {};
	for(const ops of req.body) {
		updateOps[ops.propName] = ops.value;
	}

	Product
	  .update({"_id": id}, {"$set": updateOps})
	  .exec()
	  .then(result => {
  		res.status(200).json({
  			"msg": "product updated",
  			"product": result,
  			"url": "http://localhost:3000/products/" + id
  		});
	  })
	  .catch(err => {myError(res,err,500)})
});

module.exports = router;