const asyncHandler = require("express-async-handler");
const generateAgoraToken = require('../utils/generateAgoraToken.js')
const generateChannelName = require("../utils/generateChannelName.js")

const createMeeting = asyncHandler(async(req,res)=>{
    try{
        const appId = process.env.APP_ID
        const channelName = generateChannelName();
        const tempToken = await generateAgoraToken(channelName);

        res.status(200).json({appId, channelName, token: tempToken})
    } catch(error){
        res.status(500).json({error: error.message})
    }
})

const joinMeeting = asyncHandler(async(req,res)=>{
    try{
        const channelName = req.body.channelName;
        const appId = process.env.APP_ID

        const tempToken = await generateAgoraToken(channelName);

        res.status(200).json({appId, channelName, token: tempToken})

    } catch(error) {
        console.log(error.message);
        res.status(500).json({error: error.message})
    }
})

module.exports = {
    createMeeting,
    joinMeeting
  };