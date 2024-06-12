const express = require('express');
const router = express.Router();
const orderController = require('../controllers/ordersController');
const authentication = require('../middleware/authMiddlware');

router.post("/orders", authentication, orderController.createOrder);
router.get("/orders", authentication, orderController.getAllOrders);
router.get("/orders/:id", authentication, orderController.getOrderById);
router.put("/orders/:id", authentication, orderController.updateOrder);
router.delete("/orders/:id", authentication, orderController.deleteOrder);

module.exports = router;