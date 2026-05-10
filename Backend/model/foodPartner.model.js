const mongoose = require('mongoose')

const partnerSchema = new mongoose.Schema({
    fullName: {
        type: String,
        require: true
    },
     contactName: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
  
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
      address: {
        type: String,
        required: true
    },
    lat: { type: Number, default: 24.9372 },
    lng: { type: Number, default: 67.0423 },
}, {
    timestamps: true
})
const partnerModel = mongoose.model("partner", partnerSchema);

module.exports = partnerModel;