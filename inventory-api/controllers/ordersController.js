const Order = require('../models/orders');

//get all orders
exports.createOrder = async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        res.status(500).json({ message: "Error creating the order", error: error.message });
    }
};

//get an order by id
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving orders", error: error.message });
    }
};

//create a new order
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('inventoryItem');
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving the order", error: error.message });
    }
};

//update order
exports.updateOrder = async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: "Error updating the order", error: error.message });
    }
};

//delete order
exports.deleteOrder = async (req, res) => {
    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.id);
        if (!deletedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.json({ message: "Order deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting the order", error: error.message });
    }
};