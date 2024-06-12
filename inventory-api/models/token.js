const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: false
  },
  expireAt: {
    type: Date,
    required: true,
    //ttl, expire after certain time has passes
    default: () => new Date(Date.now() + 24*60*60*1000),
    index: { expires: '1d' }
  }
});

module.exports = mongoose.model('BlacklistedToken', tokenSchema);