const asyncHandler = require("express-async-handler");
const User = require("../user/model");


//  @desc   :  Get Contact Information
//  @Route  :  GET /settings/contact/:id
//  @access :  Public
const getContactInfo = asyncHandler(async(req,res)=>{
    const id = req.params.id
    
    try {
        const user = await User.findById(id).populate("profileId").exec();

        if(!user) return res.status(404).json(`User of ${id} not found`)

        const filterUser = {
            userId: user?._id || null,
            name: user?.username || null,
            email: user?.email || null,
            number: user?.profileId?.contact || null,
            address: user?.profileId?.address || null,
            country: user?.country || null
        }

        res.status(200).json(filterUser)
    } catch (error) {
        return res.status(500).json(error.message)
    }
})

const updateContactInfo = asyncHandler(async(req,res)=>{

})

module.exports = {
    getContactInfo
}