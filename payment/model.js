const mongoose = require("mongoose");

const paymentSchema = mongoose.Schema(
  {
    clientId: {
      type: mongoose.Types.ObjectId,
      ref: "Users",
    },
    amount: {
      type: Number,
      default:null
    },
    status:{
        type: String,
        default:'pending'
    },
    trxId:{
      type: String,
      default:null
     },
     translatorId:{ 
      type: mongoose.Types.ObjectId,
      ref:"Users"
    },
    orderId:{
      type: mongoose.Types.ObjectId,
      ref:"Contracts"
    }
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model("Payments", paymentSchema);

module.exports = Payment;
