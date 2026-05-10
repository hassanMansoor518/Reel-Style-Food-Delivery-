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
    banner: {
        type: String,
        default: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1400&auto=format&fit=crop"
    },
    logo: {
        type: String,
        default: "👨‍🍳"
    },
    lat: { type: Number, default: 24.9372 },
    lng: { type: Number, default: 67.0423 },
}, {
    timestamps: true
})
const partnerModel = mongoose.model("partner", partnerSchema);

module.exports = partnerModel;