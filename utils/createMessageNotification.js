const Notifications = require("../notification/model");
const Users = require("../user/model");

const createMessageNotification = async ({ receiverId, senderId, chatId}) => {
    try {
        const sender = await Users.findById(senderId).select('-password')
      const newMessageNotification = new Notifications({
        receiverId, 
        senderId,
        text : `A new message from ${sender?.username}`,
        url: `/chat/${chatId}`,
      });
  
      const notification = await newMessageNotification.save();
      return notification;
    } catch (error) {
      console.log(error.message,"error")
      throw error;
    }
  };

  module.exports = createMessageNotification