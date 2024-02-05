const mongoose = require("mongoose");

const paymentSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "Users",
    },
    amount: {
      type: String,
      default:null
    },
    status:{
        type: String,
        enum:['rejected, approve, pending, clear'],
        default:'pending'
    }
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model("Payments", paymentSchema);

module.exports = Payment;
