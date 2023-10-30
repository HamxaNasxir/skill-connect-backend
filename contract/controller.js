const asyncHandler = require("express-async-handler");
const Contract = require("./model");

//  @desc   :  Create Contract
//  @Route  :  POST /contracts
//  @access :  Public
const createContract = asyncHandler(async(req,res)=>{
    const {clientId, jobId} = req.body;

    if( !clientId || !jobId){
        res.status(500).json("clientId or jobId is missing!")
    }

    const contract = await Contract.create({...req.body});

    res.status(200).json(contract);
})


//  @desc   :  Get Contract By Status
//  @Route  :  POST /contracts
//  @access :  Public
const getContract = asyncHandler(async(req,res)=>{
    const status = req.params.status;

    const contract = await Contract.find({status}).populate({path:"clientId", select:"-passwrord"}).populate({path:"jobId", populate:{path:"userId", select:"-password"}}).sort({createdAt:-1}).exec();

    res.status(200).json(contract);
})

module.exports = {
    createContract,
    getContract
}