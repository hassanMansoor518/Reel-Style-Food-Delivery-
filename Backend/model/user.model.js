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