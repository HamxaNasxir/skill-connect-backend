const mongoose = require('mongoose');

const withdrewSchema = mongoose.Schema({
    translatorId:{ 
        type: mongoose.Types.ObjectId,
        ref:"Users"
      },
      amount: {
        type: Number,
        default:null
      },
      status:{
          type: String,
          default:'pending'
      },
   
  



},{
    timestamps: true
});

const Withdrew = mongoose.model('Withdrew', withdrewSchema);

module.exports = Withdrew;