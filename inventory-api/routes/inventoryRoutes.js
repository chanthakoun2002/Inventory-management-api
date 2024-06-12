const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventoryController");
const authentication = require("../middleware/authMiddlware");


router.get("/items", authentication, inventoryController.getAllInventory);
router.get("/items/:id", authentication, inventoryController.getInventoryItemByID);
router.get("/items/search/:name", authentication, inventoryController.getInventoryItemByName);
router.post("/items", authentication, inventoryController.createNewInventoryItem);
router.put("/items/:id", authentication, inventoryController.updateInventoryItem);
router.delete("/items/:id", authentication, inventoryController.deleteInventoryItem);

module.exports = router;