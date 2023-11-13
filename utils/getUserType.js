const Users = require("../user/model");

const getUserType = async (id) => {
    try {
        const sender = await Users.findById(id).select('-password');

        const isClient = sender?.type === "client" ? true : false
      return isClient;
    } catch (error) {
      console.log(error.message,"error")
      throw error;
    }
  };

  module.exports = getUserType