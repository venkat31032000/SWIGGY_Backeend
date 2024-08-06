
const mongoose = require("mongoose");

const firmSchema = new mongoose.Schema({

    firmName : {
        type: String,
        required: true,
        unique: true,
    },
    area: {
        type: String,
        required: true,
    },
    
    category:
    {
      type:[{
           type: String,
           enum: ['veg',"non-veg"]
      }]
    },

    region:{
         type:[{
             type:String,
             enum:['north-indian','south-indian','chinese']
         }]

        },
    offer:{
        type: String,
    },

    image:
    {
           type:String,
    },

    vendor:[
    {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'vendor'
    }],

    product: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Firm'
    }]

});

const Firm = mongoose.model('Firm', firmSchema);

module.exports = Firm
