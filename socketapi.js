let io;
let activeUsers = [];
let socketServer = function (server) {
  io = require("socket.io")(server, { cors: { origin: "*" } });
  io.on("connection", function (socket) {
    // Add new user
    socket.on("new-user-add", (newUserId) => {
      //if user is not added previously
      if (!activeUsers.some((user) => user.userId === newUserId)) {
        activeUsers.push({ userId: newUserId, socketId: socket.id });
        console.log("New User Connected", activeUsers);
      }
      io.emit("get-users", activeUsers);
    });

    // disconnect
    socket.on("disconnect", () => {
      activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
      console.log("user Disconnected", activeUsers);

      io.emit("get-users", activeUsers);
    });

    // send-message
    socket.on("send-message", (data) => {
      const { receiverId } = data;
      const user = activeUsers.find((user) => user.userId === receiverId);
      if (user) {
        io.to(user.socketId).emit("recieve-message", data);
      }
    });

    socket.on("send-notification", (data)=>{
      const { receiverId } = data;
      const user = activeUsers.find((user) => user.userId === receiverId);
      if (user) {
      io.to(user.socketId).emit("receive-notification", data);
      }
  })
  });
};

let Socket = function () {
  return {
    emit: function (event, data) {
      io.sockets.emit(event, data);
    },
  };
};

exports.socketServer = socketServer;
exports.Socket = Socket;
