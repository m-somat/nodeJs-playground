const ordersHost = 'http://localhost:3000/orders/'
const productsHost = 'http://localhost:3000/products/'

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

const Order = require('../models/order');
const Product = require('../models/product');

function myError(res,msg,status){
	res.status(status).json({
	  	"error": msg
	})
}

router.get('/', (req,res,next) => {
	Order
	  .find()
	  .select("product quantity _id")
	  .populate('product', 'name productImg')
	  .exec()
	  .then(docs => {
	  	res.status(200).json({
	  		count: docs.length,
	  		orders: docs.map(doc => {
	  			return{
	  				"orderId": doc._id,
	  				"product": doc.product,
	  				"quantity": doc.quantity,
	  				"url": ordersHost + doc._id
	  			}
	  		})
	  	})
	  })
	  .catch(err => {myError(res,err,500)})
})

router.post('/', (req,res,next) => {
	Product
	  .findById(req.body.productId)
	  .then(product => {
	  	if(!product){
	  		return myError(res,"Product Not Found!",404)
	  	}
		const order = new Order({
			"_id": mongoose.Types.ObjectId(),
			"product": req.body.productId,
			"quantity": req.body.quantity
		})
		return order.save()
	  })
	  .then(result => {
	  	res.status(201).json({
	  		"msg": "Order stored",
	  		"order": {
	  			"_id": result._id,
	  			"product": result.product,
	  			"quantity": result.quantity
	  		},
	  		"url": ordersHost + result._id
	  	})
	  })
	  .catch(err => {myError(res,err,500)})
})


router.get('/:orderId', (req,res,next) => {
	const id = req.params.orderId

	Order
	  .findById(id)
	  .populate('product', 'name price productImg')
	  .exec()
	  .then(order => {
	  	if(!order){
	  		return myError(res,"Order Not Found!",404)
	  	} else {
	  		return res.status(200).json({
		  	  "order": order,
		  	  "referer": ordersHost
		    })
	  	}
	  })
	  .catch(err => {myError(res,err,500)})
})

router.delete('/:orderId', (req,res,next) => {
	const id = req.params.orderId
	Order
	  .remove({_id: id})
	  .exec()
	  .then(result => {
	  	res.status(200).json({
	  		"msg": "Order Deleted"
	  	})
	  })
	  .catch(err => {myError(res,err,500)})
})

module.exports = router;