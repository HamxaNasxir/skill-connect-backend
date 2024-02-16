const asyncHandler = require("express-async-handler");
const User = require('../user/model')
const Profile = require('../profile/model')
const Payment = require('../payment/model')

//  @desc   :  Get All Client Users
//  @Route  :  Get /admin/user/client
//  @access :  Public
const getAllClient = asyncHandler(async (req, res) => {
    try {
        const clientData = await User.find({ type: 'client' }).populate('profileId');
        
        res.status(200).json({
            data: clientData
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});


//  @desc   :  Get All Translator Users
//  @Route  :  Get /admin/user/translator
//  @access :  Public
const getAllTranslator = asyncHandler(async (req, res) => {
    try {
        const translatorData = await User.find({ type: 'translator' }).populate('profileId');
        
        res.status(200).json({
            data: translatorData
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

//  @desc   :  PUT Update the User profile
//  @Route  :  PUT /admin/user/:id
//  @access :  Public
const updateUser = asyncHandler(async (req, res) => {
    try {
        const userId = req.params.id;

        const updatedProfile = await Profile.findOneAndUpdate(
            { userId },
            { $set: { ...req.body } },
            { new: true }
        );

        if (!updatedProfile) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        res.status(200).json({ message: 'Profile has been updated!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


//  @desc   :  DELETE All Client Users
//  @Route  :  DELETE /admin/user/:id
//  @access :  Public
const deleteUser = asyncHandler(async (req, res) => {
    try {
        const userId = req.params.id;
        const result = await User.deleteOne({ _id: userId });

        if (result.deletedCount === 0) {
            // No document was deleted, user with the given ID not found
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({
            message: 'User deleted successfully'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// ******************************* Payments *********************************


//  @desc   :  Get All Translator payment
//  @Route  :  Get /admin/payment/client
//  @access :  Public
const getTranslatorCard = asyncHandler(async (req, res) => {
    try {
        const data = await Payment.find({}) 
        .populate({
            path: 'userId',
            model: 'Users',
            match: { type: 'translator' } 
        })
        .exec();
        
        res.status(200).json({
            data
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//  @desc   :  PUT All Translator payment
//  @Route  :  PUT /admin/payment
//  @access :  Public
const updatePayment = asyncHandler(async (req, res) => {
    try {
        const paymentId = req.params.id;
        const { status, amount } = req.body;

        // Validate status value against the allowed values
        const allowedStatusValues = ['rejected', 'approve', 'pending', 'clear'];
        if (!allowedStatusValues.includes(status)) {
            return res.status(400).json({ error: 'Invalid status value' });
        }

        // Update payment using findOneAndUpdate
        const updatedPayment = await Payment.findOneAndUpdate(
            { _id: paymentId },
            { $set: { status, amount } },
            { new: true }
        );

        if (!updatedPayment) {
            return res.status(404).json({ error: 'Payment not found' });
        }

        res.status(200).json({ message: 'Payment updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


const ViewClearedPayment = asyncHandler(async (req, res) => {
    try {

        const clearedPayments = await Payment.find({ status: 'clear' })
        .populate({
            path: 'userId',
            model: 'Users',
        })
        .exec();
        res.status(200).json({
            clearedPayments
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = {
    getAllClient,
    getAllTranslator,
    deleteUser,
    updateUser,
    getTranslatorCard,
    updatePayment,
    ViewClearedPayment
}