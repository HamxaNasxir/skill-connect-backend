let io;
let activeUsers = [];
let socketServer = function (server) {
  io = require("socket.io")(server, { cors: { origin: "*" } });
  io.on("connection", function (socket) {
    // Add new user
    socket.on("new-user-add", (newUserId) => {
      console.log(activeUsers)
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

      // For ending video call
      socket.broadcast.emit("callEnded")

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

    // ********************** For video call *********************
    // For sending Id to copy
    socket.emit('myId', socket.id)

    // For answering the Calling of a user
    socket.on("answerCall", (data) => {
      io.to(data.to).emit("callAccepted", data.signal)
    });

    // For calling to user
    socket.on("callUser", ({ userToCall, signalData, from, name }) => {
      console.log({ userToCall, signalData, from, name })
      const userToCallSocektId = activeUsers.filter(item => item.userId === userToCall);
      if(userToCallSocektId){
        io.to(userToCallSocektId).emit("callUser", { signal: signalData, from, name });
      }
    });


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
