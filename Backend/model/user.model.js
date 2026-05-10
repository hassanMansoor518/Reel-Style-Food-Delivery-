const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
    },

     PhoneNumber: {
        type: String,
        required: true
   }, 
   Address: {
        type: String,
        required: true
   },
    lat: { type: Number, default: 24.9107 },
    lng: { type: Number, default: 67.0311 },
    avatar: {
      type: String,
      default: null,
    },

}, 
  
    {
        timestamps: true
    }
)

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;