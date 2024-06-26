const asyncHandler = require("express-async-handler");
const Contract = require("./model");
const createInvitationNotification = require("../utils/createInvitationNotification");
const contractDescisionNotification = require("../utils/contractDescisionNotification");
const getUserType = require("../utils/getUserType");

//  @desc   :  Create Contract
//  @Route  :  POST /contracts
//  @access :  Public
const createContract = asyncHandler(async(req,res)=>{
    const {clientId, jobId} = req.body;

    if( !clientId || !jobId){
        res.status(500).json("clientId or jobId is missing!")
    }

    const contract = await Contract.create({...req.body});

    createInvitationNotification({jobId,clientId})

    res.status(200).json(contract);
})


//  @desc   :  Get Contract By Status
//  @Route  :  GET /contracts/:status/:id
//  @access :  Public
const getContract = asyncHandler(async (req, res) => {
    const { status,id } = req.params;
    let filterStatus;

    switch (status) {
        case 'Invitations':
            filterStatus = 'Accept';
            break;
        case 'Completed':
            filterStatus = 'Completed';
            break;
        case 'Rejected':
            filterStatus = 'Reject';
            break;
        default:
            return res.status(400).json('Invalid status parameter');
    }


    try {
        const isClient = await getUserType(id);

        if(isClient){
            const contracts = await Contract.find({ status: filterStatus })
            .populate({
                path: 'clientId',
                select: '-password'
            })
            .populate({
                path: 'jobId',
                populate: {
                    path: 'userId',
                    select: '-password'
                }
            })
            .sort({ createdAt: -1 })
            .exec();

            const filteredContract = contracts.filter(items => items?.jobId?.userId?._id == id);

            res.status(200).json(filteredContract);
        } else {
            const contracts = await Contract.find({ status: filterStatus, clientId: id })
            .populate({
                path: 'clientId',
                select: '-password'
            })
            .populate({
                path: 'jobId',
                populate: {
                    path: 'userId',
                    select: '-password'
                }
            })
            .sort({ createdAt: -1 })
            .exec();

        res.status(200).json(contracts);
        }
        
    } catch (error) {
        res.status(500).json(error.message);
    }
});


//  @desc   :  Get Contract By UserId and ClientId
//  @Route  :  GET /contracts/:userId/:clientId
//  @access :  Public
const getContractByUserID = asyncHandler(async(req, res)=>{
    const userId = req.params.userId;
    const clientId = req.params.clientId // ClientId is of translator

    try{
        const contract = await Contract.find({status:"Pending"}).populate({path:"jobId", populate: "userId"}).sort({createdAt:-1}).exec();
    
        const filteredContract = contract.filter((item)=> item?.clientId == clientId && item?.jobId?.userId?._id == userId)
    
        res.status(200).json(filteredContract)

    } catch(error){
        return res.status(500).json(error.message)
    }

})

//  @desc   :  Get Invitations
//  @Route  :  GET /contracts/:id
//  @access :  Public
const getInvitations = asyncHandler(async(req,res)=>{
    const id = req.params.id
    try{
        const invitations = await Contract.find({status:"Pending", clientId:id}).populate({path:"clientId", select:"-password", populate:"profileId"}).populate({path:"jobId", populate:{path:"userId", select:"-password",  populate:"profileId"}}).sort({createdAt:-1}).exec()
    
        const count = await Contract.countDocuments({status:"Pending", clientId:id});
    
        res.status(200).json({data: invitations, count})
    } catch(error){
        res.status(500).json(error.message)
    }
})

//  @desc   :  Accept or reject Invitation
//  @Route  :  PUT /contracts
//  @access :  Public
const contractDecision = asyncHandler(async(req, res)=>{
    const {id, decision} = req.body;

    try{
       const updatedContract = await Contract.updateOne({_id:id},{status:decision},{new:true});

       if(!updatedContract){
        return res.status(404).json('Contract not found')
       }
    
        res.status(200).json(`Contract has been ${decision}`)

        contractDescisionNotification({id, decision})

    } catch(error){
        res.status(500).json(error.message)
    }

})

//  @desc   :  Get Contract ClientId
//  @Route  :  GET /overallcontracts/client/:id
//  @access :  Public
const getOverallOrders = asyncHandler(async(req, res)=>{
    const clientId = req.params.id 

    try{
        const contract = await Contract.find({clientId:clientId}).populate({path:"jobId", populate: "userId"}).sort({createdAt:-1}).exec();
        res.status(200).json(contract)

    } catch(error){
        return res.status(500).json(error.message)
    }

})

module.exports = {
    createContract,
    getContract,
    contractDecision,
    getInvitations,
    getContractByUserID,
    getOverallOrders
}