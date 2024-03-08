// let io;
// let activeUsers = [];
// let socketServer = function (server) {
//   io = require("socket.io")(server, { cors: { origin: "*" } });
//   io.on("connection", function (socket) {
//     // Add new user
//     socket.on("new-user-add", (newUserId) => {
//       console.log(activeUsers)
//       //if user is not added previously
//       if (!activeUsers.some((user) => user.userId === newUserId)) {
//         activeUsers.push({ userId: newUserId, socketId: socket.id });
//         console.log("New User Connected", activeUsers);
//       }
//       io.emit("get-users", activeUsers);
//     });

//     // disconnect
//     socket.on("disconnect", () => {
//       activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
//       console.log("user Disconnected", activeUsers);

//       // For ending video call
//       socket.broadcast.emit("callEnded")

//       io.emit("get-users", activeUsers);
//     });

//     // send-message
//     socket.on("send-message", (data) => {
//       const { receiverId } = data;
//       const user = activeUsers.find((user) => user.userId === receiverId);
//       if (user) {
//         io.to(user.socketId).emit("recieve-message", data);
//       }
//     });

//     socket.on("send-notification", (data)=>{
//       const { receiverId } = data;
//       const user = activeUsers.find((user) => user.userId === receiverId);
//       if (user) {
//       io.to(user.socketId).emit("receive-notification", data);
//       }
//     })

//     // ********************** For video call *********************
//     // For sending Id to copy
//     socket.emit('myId', socket.id)

//     // For answering the Calling of a user
//     socket.on("answerCall", (data) => {
//       io.to(data.to).emit("callAccepted", data.signal)
//     });

//     // For calling to user
//     socket.on("callUser", ({ userToCall, signalData, from, name }) => {
//       console.log({ userToCall, signalData, from, name })
//       const userToCallSocektId = activeUsers.filter(item => item.userId === userToCall);
//       if(userToCallSocektId){
//         io.to(userToCallSocektId).emit("callUser", { signal: signalData, from, name });
//       }
//     });


//   });
// };

// let Socket = function () {
//   return {
//     emit: function (event, data) {
//       io.sockets.emit(event, data);
//     },
//   };
// };

// exports.socketServer = socketServer;
// exports.Socket = Socket;



// socketapi.js
// socketapi.js

// const { Server } = require("socket.io");

// function socketServer(server) {
//     const io = new Server(server, {
//         cors: {
//             origin: "*",
//             methods: ["GET", "POST"]
//         }
//     });

//     // Middleware to handle socket authentication
//     io.use((socket, next) => {
//         if (socket.handshake.query?.callerId) {
//             socket.user = socket.handshake.query.callerId;
//             next();
//         } else {
//             console.log("No token found");
//             next(new Error("No token found"));
//         }
//     });

//     // Store users and their rooms
//     let users = {};

//     // Function to handle socket events
//     io.on('connection', (socket) => {
//         console.log("new connection on socket server user is ", socket.user);

//         socket.join(socket.user);

//         // notify this user of online users
//         io.to(socket.user).emit("new-users", { users: Object.keys(users) });

//         // notify existent users that a new user just joined
//         Object.keys(users).forEach(user => {
//             io.to(user).emit("new-user", { user: socket.user });
//         });
//         users[socket.user] = socket.id;

//         // Define socket event handlers
//         socket.on('start-call', ({ to }) => {
//             console.log("initiating call request to ", to);
//             io.to(users[to]).emit("incoming-call", { from: socket.user });
//         });

//         socket.on("accept-call", ({ to }) => {
//             console.log("call accepted by ", socket.user, " from ", to);
//             io.to(users[to]).emit("call-accepted", { to });
//         });

//         socket.on("deny-call", ({ to }) => {
//             console.log("call denied by ", socket.user, " from ", to);
//             io.to(users[to]).emit("call-denied", { to });
//         });

//         socket.on("leave-call", ({ to }) => {
//             console.log("left call message by ", socket.user, " from ", to);
//             io.to(users[to]).emit("left-call", { to });
//         });

//         socket.on("offer", ({ to, offer }) => {
//             console.log("offer from ", socket.user, " to ", to);
//             io.to(users[to]).emit("offer", { to, offer });
//         });

//         socket.on("offer-answer", ({ to, answer }) => {
//             console.log("offer answer from ", socket.user, " to ", to);
//             io.to(users[to]).emit("offer-answer", { to, answer });
//         });

//         socket.on("ice-candidate", ({ to, candidate }) => {
//             console.log("ice candidate from ", socket.user, " to ", to);
//             io.to(users[to]).emit("ice-candidate", { to, candidate });
//         });

   
        

//         socket.on("disconnect", (reason) => {
//             delete users[socket.user];
//             Object.keys(users).forEach(user => {
//                 io.to(users[user]).emit("user-left", { user: socket.user });
//             });
//             console.log("a socket disconnected ", socket.user);
//         });
//     });
// }

// module.exports = { socketServer };


const { Server } = require("socket.io");

function socketServer(server) {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    // Middleware to handle socket authentication
    io.use((socket, next) => {
        if (socket.handshake.query?.callerId) {
            socket.user = socket.handshake.query.callerId;
            next();
        } else {
            console.log("No token found");
            next(new Error("No token found"));
        }
    });

    // Store users and their rooms
    let users = {};

    // Function to handle socket events
    io.on('connection', (socket) => {
        console.log("new connection on socket server user is ", socket.user);

        socket.join(socket.user);

        // notify this user of online users
        io.to(socket.user).emit("new-users", { users: Object.keys(users) });

        // notify existent users that a new user just joined
        Object.keys(users).forEach(user => {
            io.to(user).emit("new-user", { user: socket.user });
        });
        users[socket.user] = socket.id;

        // Define socket event handlers
        socket.on('start-call', ({ to }) => {
            console.log("initiating call request to ", to);
            to.forEach(recipient => {
                if (users[recipient]) {
                    io.to(users[recipient]).emit("incoming-call", { from: socket.user });
                } else {
                    console.log("User not found:", recipient);
                }
            });

            console.log("Total users in call:", to.length);
        });

        socket.on("accept-call", ({ to }) => {
            console.log("call accepted by ", socket.user, " from ", to);
            io.to(users[to]).emit("call-accepted", { to: socket.user });
        });

        socket.on("deny-call", ({ to }) => {
            console.log("call denied by ", socket.user, " from ", to);
            io.to(users[to]).emit("call-denied", { to: socket.user });
        });

        socket.on("leave-call", ({ to }) => {
            console.log("left call message by ", socket.user, " from ", to);
            io.to(users[to]).emit("left-call", { to: socket.user });
        });

        socket.on("offer", ({ to, offer }) => {
            console.log("offer from ", socket.user, " to ", to);
            to.forEach(recipient => {
                if (users[recipient]) {
                    io.to(users[recipient]).emit("offer", { to: recipient, offer });
                } else {
                    console.log("User not found:", recipient);
                }
            });
        });

        socket.on("offer-answer", ({ to, answer }) => {
            console.log("offer answer from ", socket.user, " to ", to);
            io.to(users[to]).emit("offer-answer", { from: socket.user, answer });
        });

        socket.on("ice-candidate", ({ to, candidate }) => {
            console.log("ice candidate from ", socket.user, " to ", to);
            io.to(users[to]).emit("ice-candidate", { from: socket.user, candidate });
        });

        socket.on("disconnect", (reason) => {
            delete users[socket.user];
            Object.keys(users).forEach(user => {
                io.to(users[user]).emit("user-left", { user: socket.user });
            });
            console.log("a socket disconnected ", socket.user);
        });
    });
}

module.exports = { socketServer };





