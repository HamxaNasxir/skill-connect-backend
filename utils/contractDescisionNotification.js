const Notifications = require("../notification/model");
const Users = require("../user/model");
const Jobs = require("../job/model");
const Contracts = require("../contract/model");

const contractDescisionNotification = async ({ id, decision}) => {
    try {
        const contract = await Contracts.findById(id).populate("clientId").exec();
        const jobId = contract?.jobId
        const clientId = contract?.clientId?._id
        const username = contract?.clientId?.username
        const job = await Jobs.findById(jobId).populate("userId")
        const senderId = job?.userId?._id;
        const sender = await Users.findById(senderId).select('-password')

      const newInvitationNotification = new Notifications({
        receiverId: senderId, 
        senderId: clientId,
        text : `${username} has ${decision} your invitation`,
        url: `/decision/${jobId}`,
      });
  
      const notification = await newInvitationNotification.save();
      return notification;
    } catch (error) {
      console.log(error.message,"error")
      throw error;
    }
  };

  module.exports = contractDescisionNotification