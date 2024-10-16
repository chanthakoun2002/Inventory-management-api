const Order = require('../models/orders');

// Create a new order
exports.createOrder = async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        res.status(500).json({ message: "Error creating the order", error: error.message });
    }
};

// Get all orders, populated with inventory item names
exports.getAllOrders = async (req, res) => {
    try {
        // Populate the inventoryItem field with the name field from the Inventory model
        const orders = await Order.find().populate('inventoryItem', 'name');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving orders", error: error.message });
    }
};

// Get an order by ID, populated with inventory item name
exports.getOrderById = async (req, res) => {
    try {
        // Populate the inventoryItem field with the name field from the Inventory model
        const order = await Order.findById(req.params.id).populate('inventoryItem', 'name');
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving the order", error: error.message });
    }
};

// Update an order
exports.updateOrder = async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('inventoryItem', 'name');
        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: "Error updating the order", error: error.message });
    }
};

// Delete an order
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
