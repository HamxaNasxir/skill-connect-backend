const Notifications = require("../notification/model");
const Users = require("../user/model");
const Jobs = require("../job/model");

const createInvitationNotification = async ({ jobId, clientId}) => {
    try {
        const job = await Jobs.findById(jobId).populate("userId")
        const senderId = job?.userId?._id;
        const sender = await Users.findById(senderId).select('-password')

      const newInvitationNotification = new Notifications({
        receiverId: clientId, 
        senderId,
        text : `A new invitation from ${sender?.username}`,
        url: `/job/${jobId}`,
      });
  
      const notification = await newInvitationNotification.save();
      return notification;
    } catch (error) {
      console.log(error.message,"error")
      throw error;
    }
  };

  module.exports = createInvitationNotification