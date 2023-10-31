const mongoose = require("mongoose");

const contractSchema = new mongoose.Schema({
    clientId:{
        type: mongoose.Types.ObjectId,
        ref: "Users"
    },
    jobId:{
        type: mongoose.Types.ObjectId,
        ref: "Jobs"
    },
    status:{
        type:String,
        default: "Pending"
    }
},{
    timestamps:true
});

const Contract = mongoose.model("Contracts", contractSchema);

module.exports = Contract;