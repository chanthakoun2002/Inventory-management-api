const InventoryItem = require('../models/inventory');

//get all items
exports.getAllInventory = async (req, res) => {
    try {
        const items = await InventoryItem.find();
        res.json(items);
    } catch (error) {
        res.status(500).json("Error retrieving inventory items.");
    }
};

//get item by id
exports.getInventoryItemByID = async (req, res) => {
    try {
        const item = await InventoryItem.findById(req.params.id);
        if (!item) return res.status(404).send(`Item "${req.params.id}" not found.`);
        res.json(item);
    } catch (error) {
        res.status(500).json("Error retrieving the inventory item.");
    }
};

//get item by name
exports.getInventoryItemByName = async (req, res) => {
    try {
        const regex = new RegExp(req.params.name, 'i');

        const items = await InventoryItem.find({ name: { $regex: regex } });
        if (!items.length) return res.status(404).send("Item not found.");
        res.json(items);
    } catch (error) {
        res.status(500).json("Error retrieving the inventory item by name.");
    }
};

//create a new item
exports.createNewInventoryItem = async (req, res) => {
    try {
        const newItem = new InventoryItem(req.body);
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (error) {
        res.status(500).json("Error creating inventory item.");
    }
};

//update item
exports.updateInventoryItem = async (req, res) => {
    try {
        const updatedItem = await InventoryItem.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedItem) return res.status(404).send("Item not found.");
        res.json(updatedItem);
    } catch (error) {
        res.status(500).json("Error updating inventory item.");
    }
}

//delete item (by id)
exports.deleteInventoryItem = async (req, res) => {
    try {
        const deletedItem = await InventoryItem.findByIdAndDelete(req.params.id);
        if (!deletedItem) return res.status(404).send("Item not found.");
        res.json({ message: "Item deleted successfully." });
    } catch (error) {
        res.status(500).json("Error deleting inventory item.");
    }
}