const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ordersSchema = new Schema({
    customer: {
        type: String,
        required: true,
        trim: true
    },
    inventoryItem: {
        type: Schema.Types.ObjectId,
        ref: 'Inventory',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    status: {
        type: String,
        default: "Pending"
    },
    totalPrice: {
        type: Number,
        required: false
    },
    orderDetails: {
        type: String,
        required: false
    },
    date: {
        type: Date,
        default: Date.now,
      },
});

module.exports = mongoose.model("Order", ordersSchema);