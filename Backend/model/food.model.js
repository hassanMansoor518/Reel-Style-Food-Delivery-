const mongoose = require("mongoose")
const foodSchema = new mongoose.Schema({

    name:{
      type:String,
      require:true
    },

    video:{
      type:String,
      require:true  
    },

    description:{
      type:String,
      require:true
    },

    price:{
      type:Number,
      require:true
    },
    rating:{
      type:Number,
      require:true
    },

    foodPartner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"partner"
    } 
})

const foodModel = mongoose.model("food", foodSchema);
module.exports = foodModel;