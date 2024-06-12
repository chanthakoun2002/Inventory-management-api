const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    }, 
    quantity : {
        type: Number,
        required: true,
        min: 0,
        default: 0
    }, 
    location: {
        type: String,
        required: false,
        trim: true
    }, 
    description: {
        type: String,
        required: false,
        max: 200
    }, 
    pricePerItem: {
        type: Number,
        required: true,
        min: 0,
        validate: {
            validator: function(v) {
                return (v * 100) % 1 === 0;
            },
            message: props => `${props.value} is not a valid price.`
        }
    },
    date: {
        type: Date,
        default: Date.now,
      },
})

module.exports = mongoose.model("Inventory", inventorySchema);