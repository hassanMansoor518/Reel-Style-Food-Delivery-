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
}, {
    timestamps: true
})
const partnerModel = mongoose.model("partner", partnerSchema);

module.exports = partnerModel;