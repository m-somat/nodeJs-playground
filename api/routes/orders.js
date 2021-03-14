const express = require('express');
const router = express.Router();

router.get('/', (req,res,next) => {
	res.status(200).json({
		"msg": 'Orders fetched'
	})
})

router.post('/', (req,res,next) => {
	const order = {
		"productId": req.body.productId,
		"quantity": req.body.quantity
	}

	res.status(201).json({
		"msg": 'Orders sent',
		"order": order
	})
})


router.get('/:orderId', (req,res,next) => {
	const id = req.params.orderId
	res.status(200).json({
		"msg": 'Order ID: ' + id
	})
})

router.delete('/:orderId', (req,res,next) => {
	const id = req.params.orderId
	res.status(200).json({
		"msg": 'Deleted order: ' + id
	})
})

module.exports = router;