const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product');

// Products handler
router.get('/', (req,res,next) => {
	Product
	  .find()
	  .exec()
	  .then(docs => {
	  	console.log(docs);
	  	res.status(200).json(docs);
	  })
	  .catch(err => {
	  	console.log(err);
	  	res.status(500).json({
	  		"error": err
	  	})
	  })
})

router.post('/', (req,res,next) => {
	const product = new Product({
		"_id": new mongoose.Types.ObjectId(),
		"name": req.body.name,
		"price": req.body.price
	})

	product
	  .save()
	  .then(result => {
		console.log(result);
		res.status(201).json({
			"msg": 'products sent',
			"product": result
		})
	  })
	  .catch(err => {
	  	console.log(err);
	  	res.status(500).json({"error":err})
	  });
});


// Singular Product handler
router.get('/:productId', (req,res,next) => {
	const id = req.params.productId;
	Product.findById(id)
	  .exec()
	  .then(doc => {
	  	console.log("From Database", doc);
	  	if (doc){
	  		res.status(200).json(doc);
	  	} else{
	  		res.status(404).json({"msg": "product doesn't exist"})
	  	}
	  })
	  .catch(err => {
	  	console.log(err);
	  	res.status(500).json({"error":err})
	  });
});

router.delete('/:productId', (req,res,next) => {
	const id = req.params.productId;

	Product
	  .findOneAndDelete({"_id": id})
	  .exec()
	  .then(result => {
	  	res.status(200).json("Deleted product: " + result._id);
	  })
	  .catch(err => {
	  	console.log(err);
	  	res.status(500).json({
	  		"error": err
	  	})
	  });
});

router.patch('/:productId', (req,res,next) => {
	const id = req.params.productId;
	const updateOps = {};

	for(const ops of req.body) {
		updateOps[ops.propName] = ops.value;
	}

	Product
	  .update({"_id": id}, {"$set": updateOps})
	  .exec()
	  .then(result => {
	  	console.log(result);
	  	res.status(200).json(result);
	  })
	  .catch(err => {
	  	console.log(err);
	  	res.status(500).json({
	  		"error": err
	  	});
	  });
});

module.exports = router;