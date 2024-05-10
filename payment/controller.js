const asyncHandler = require("express-async-handler");
const transectionHistory = require("./model");
const Contract = require("../contract/model");
const createTrx = asyncHandler(async (req, res) => {
    try {
 
      const newTrx = new transectionHistory(req.body);
      const result = await newTrx.save();
    //   await User.updateOne({_id:userId},{profileId:result?._id},{new:true});
      res.status(200).json("Payment Transfer Successfully");
    } catch (error) {
      res.status(500).json(error.message);
    }
  });

  const getClientTrx = asyncHandler(async(req, res)=>{
    const clientId = req.params.id;
    const startDate = req.query.startDate ? new Date(req.query.startDate) : null;
    const endDate = req.query.endDate ? new Date(req.query.endDate) : null;

    let query = {
        clientId: clientId
     
    };

    if (startDate && endDate && !isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
        query.createdAt = { $gte: startDate, $lte: endDate };
    }
    try {
        const paymentsdata = await transectionHistory.find(query)
        .populate(["clientId", "orderId", "translatorId"])
            .sort({ createdAt: -1 })
            .exec();
        res.status(200).json(paymentsdata);
    } catch(error) {
        return res.status(500).json(error.message);
    }
});

const getBalance =  asyncHandler(async(req, res)=>{
    const {id , status} = req.params
    transectionHistory.find({ translatorId: id, status: status })
    .then(result => {
        if (result && result?.length > 0) {
            const totalAmount = result?.reduce((total, payment) => total + payment.amount, 0);
          
            res.status(200).json({ totalAmount: totalAmount })
        } else {
           
            res.status(200).json("No data found for the given criteria.")
        }
    })
    .catch(err => {
        console.error("Error:", err);
    });
    
});

const getTranslatorTrx = asyncHandler(async(req, res)=>{
    const translatorid = req.params.id;
    const status = req.params.status;
    const startDate = req.query.startDate ? new Date(req.query.startDate) : null;
    const endDate = req.query.endDate ? new Date(req.query.endDate) : null;

    // Build the query object dynamically
    let query = {
        translatorId: translatorid,
        ...(status ===":status" ? "" : { status: status }),
    };

    // Add date range to query if both startDate and endDate are valid
    if (startDate && endDate && !isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
        query.createdAt = { $gte: startDate, $lte: endDate };
    }

    try {
        const paymentsdata = await transectionHistory.find(query)
        .populate(["clientId", "orderId", "translatorId"])
        .sort({ createdAt: -1 })
        .exec();

        res.status(200).json(paymentsdata);
    } catch(error) {
        return res.status(500).json(error.message);
    }
});

const getStats = asyncHandler(async(req, res) => {
    const { id } = req.params;
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
    const startDate = req.query.startDate ? new Date(req.query.startDate) : null;
    const endDate = req.query.endDate ? new Date(req.query.endDate) : null;


    let query = {
        translatorId: id,
        status: "clear",
        createdAt: { $gte: twelveMonthsAgo }
    };
    if (startDate && endDate && !isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
        query.createdAt = { $gte: startDate, $lte: endDate };
    }

    transectionHistory.find(query)
    .sort({ createdAt: 1 }) 
    .then(result => {
        if (result && result.length > 0) {
            const amounts = result?.map(payment => ({ amount: payment.amount, createdAt: payment.createdAt }));
            const totalAmount = result.reduce((total, payment) => total + payment.amount, 0);
            res.status(200).json({ totalAmount: totalAmount , result:amounts });
        } else {
            res.status(200).json("No data found for the given criteria.");
        }
    })
    .catch(err => {
        console.error("Error:", err);
    });
});


  module.exports = {
    createTrx,
    getClientTrx,
    getBalance,
    getTranslatorTrx,
    getStats
    
}