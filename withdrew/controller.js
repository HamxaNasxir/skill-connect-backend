const asyncHandler = require("express-async-handler");
const withdrewreq = require("./model");
const transectionHistory =  require("../payment/model")


const createWithdrew = asyncHandler(async (req, res) => {
    try {
      
      let totalamountchecker ; 
        const { translatorId , amount } = req.body; 
      
    
       
        const existingRequest = await withdrewreq.findOne({
            translatorId: translatorId,
            status: { $ne: "completed" } 
        });
        if (existingRequest) {
            return res.status(400).json("Your Withdrawal request already exists.");
        }

        transectionHistory.find({ translatorId: translatorId, status: "clear" }).then((checkamount)=>{
            totalamountchecker =  checkamount?.reduce((total, payment) => total + payment.amount, 0);
            
           })
           if(totalamountchecker===amount){
            const newTrx = new withdrewreq(req.body);
            const result = await newTrx.save();
            // await User.updateOne({_id: userId}, {profileId: result?._id}, {new: true});
            res.status(200).json("Withdrew Request Created Successfully");
           }
           else{
            return res.status(400).json("Insufficient Balance");
           }

      
    } catch (error) {
        res.status(500).json(error.message);
    }
});
const withdrew = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        // First, update the transaction history for the given translator ID and status
        const updateResult = await transectionHistory.updateMany(
            { translatorId: id, status: "clear" },
            { $set: { amount: 0 } }
        );
        if (updateResult.matchedCount > 0) {
            await withdrewreq.updateOne(
                { translatorId: id, status: { $ne: "completed" } },
                { status: "completed" }
            );

            res.status(200).json("Withdrew Completed");
        } else {
            res.status(200).json("No data found for the given criteria.");
        }
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json(err.message);
    }
});

  module.exports = {
    createWithdrew,
    withdrew
    
}