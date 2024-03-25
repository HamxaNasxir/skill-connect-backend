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
//         io.to(user.socketId).emit("receive-notification", data);
//       }
//     })

//     // For video call
//     socket.emit('myId', socket.id)

//     socket.on('callUser', ({ userToCall, signalData, from, name }) => {
//       console.log({ userToCall, signalData, from, name });
//       const userToCallSocektId = activeUsers.find(item => item.userId === userToCall);
//       if (userToCallSocektId) {
//         io.to(userToCallSocektId.socketId).emit("callUser", { signal: signalData, from, name });
//       }
//     });

//     socket.on('answerCall', (data) => {
//       io.to(data.to).emit("callAccepted", data.signal)
//     });

//     // Receive ICE candidates
//     socket.on('iceCandidate', ({ targetSocketId, candidate }) => {
//       const targetSocket = activeUsers.find(user => user.socketId === targetSocketId);
//       if (targetSocket) {
//         io.to(targetSocketId).emit('iceCandidate', candidate);
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


const { Server } = require("socket.io");

function socketServer(server) {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    // Store users and their rooms
    const rooms = {};

    // Function to handle socket events
    io.on('connection', (socket) => {
        console.log("New connection on socket server" , socket.user);

        // Function to join user to a room with a random username
        const joinRoom = ({ roomId, userName }) => {
            console.log("3232" ,roomId , userName )
            socket.join(roomId);
            const roomsdata = io.sockets.adapter.rooms
            console.log("users in room" , roomsdata)
            if (!rooms[roomId]) {
                rooms[roomId] = [];
            }
            rooms[roomId].push(userName);
            io.to(roomId).emit("new-user", { user: userName });
        };

        // Handle join-room event
        socket.on('join-room', ({ roomId, userName }) => {
            joinRoom({ roomId, userName });
        });

        // Handle start-call event
        socket.on('start-call', ({ to }) => {
            console.log("Initiating call request from ", socket.user, " to ", to);
            io.to(to).emit("incoming-call", { from: socket.user });
        });

        // Handle accept-call event
        socket.on("accept-call", ({ from }) => {
            console.log("Call accepted by ", socket.user, " from ", from);
            io.to(socket.roomid).emit("call-accepted", { from });
        });

        // Handle deny-call event
        socket.on("deny-call", ({ from }) => {
            console.log("Call denied by ", socket.user, " from ", from);
            io.to(from).emit("call-denied", { from });
        });

        // Handle leave-call event
        socket.on("left-call", ({ from }) => {
            console.log("Left call message by ", socket.user, " from ", from);
            io.to(socket.roomid).emit("left-call", { from });
        });

        // Handle offer event
        socket.on("offer", ({ to, offer }) => {
            console.log("Offer from ", socket.user, " to ", to);
            io.to(to).emit("offer", { from: socket.user, offer });
        });

        // Handle offer-answer event
        socket.on("offer-answer", ({ from, answer }) => {
            console.log("Offer answer from ", socket.user, " to ", from);
            io.to(from).emit("offer-answer", { to: socket.user, answer });
        });

        // Handle ice-candidate event
        socket.on("ice-candidate", ({ to, candidate }) => {
            console.log("ICE candidate from ", socket.user, " to ", to);
            io.to(to).emit("ice-candidate", { from: socket.user, candidate });
        });

        // Handle disconnect event
        socket.on("disconnect", () => {
            // Remove user from the room
            for (let room in rooms) {
                if (rooms.hasOwnProperty(room)) {
                    rooms[room] = rooms[room].filter(user => user !== socket.user);
                    io.to(room).emit("user-left", { user: socket.user });
                }
            }
            console.log("A socket disconnected");
        });
    });
}

module.exports = { socketServer };





// const { Server } = require("socket.io");

// function socketServer(server) {
//     const io = new Server(server, {
//         cors: {
//             origin: "*",
//             methods: ["GET", "POST"]
//         }
//     });

//     // Store users and their rooms
//     let users = {};

//     io.on('connection', (socket)=> {
//         console.log("new connection on socker server user is ", socket.user)
//         socket.join(socket.user)
//         // notify this user of online users
//         io.to(socket.user).emit("new-users", { users: Object.keys(users) });
//         // notify existent users that a new user just joined
//         if (!users.hasOwnProperty(socket.user)) {
//             Object.keys(users).forEach((user) => {
//                 io.to(user).emit("new-user", { user: socket.user });
//             });
//             users[socket.user] = true;
//         }
//         // when we get a call to start a call
//         socket.on('start-call', ({ to })=> {
//             console.log("initiating call request to ", to)
//             io.to(to).emit("incoming-call", { from: socket.user })
//         })
//         // when an incoming call is accepted
//         socket.on("accept-call", ({ to })=> {
//             console.log("call accepted by ", socket.user, " from ", to)
//             io.to(to).emit("call-accepted", { to })
//         })
//         // when an incoming call is denied
//         socket.on("deny-call", ({ to })=> {
//             console.log("call denied by ", socket.user, " from ", to)
//             io.to(to).emit("call-denied", { to })
//         })
//         // when a party leaves the call
//         socket.on("leave-call", ({ to })=> {
//             console.log("left call mesg by ", socket.user, " from ", to)
//             io.to(to).emit("left-call", { to })
//         })
//         // when an incoming call is accepted,..
//         // caller sends their webrtc offer
//         socket.on("offer", ({ to, offer })=> {
//             console.log("offer from ", socket.user, " to ", to)
//             io.to(to).emit("offer", { to, offer })
//         })
//         // when an offer is received,..
//         // receiver sends a webrtc offer-answer
//         socket.on("offer-answer", ({ to, answer })=> {
//             console.log("offer answer from ", socket.user, " to ", to)
//             io.to(to).emit("offer-answer", { to, answer })
//         })
//         // when an ice candidate is sent
//         socket.on("ice-candidate", ({ to, candidate })=> {
//             console.log("ice candidate from ", socket.user, " to ", to)
//             io.to(to).emit("ice-candidate", { to, candidate })
//         })
    
//         socket.on("add-third-person", ({ to }) => {
//             console.log("Request to add third person from ", socket.user, " to ", to);
//             io.to(to).emit("request-add-third-person", { from: socket.user });
//             // Automatically add the third person to the call
//             io.to(to).emit("incoming-call", { from: socket.user });
//             io.to(to).emit("third-person-added", { to });
//         });

//         socket.on("disconnect", (reason) => {
//             if (socket.user && users.hasOwnProperty(socket.user)) {
//                 delete users[socket.user];
//                 for (let user in users) {
//                     io.to(user).emit("user-left", { user: socket.user });
//                 }
//                 console.log("a socket disconnected ", socket.user);
//             }
//         });
        
//     });
// }

// module.exports = { socketServer };






