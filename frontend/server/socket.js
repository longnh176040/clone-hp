let io;

let users = [];
let admins = [];

module.exports = {
  init: (httpServer) => {
    io = require("socket.io")(httpServer, {
      cors: {
        origin: ["http://localhost:4200", "https://hp.minastik.com"],
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true,
        allowEIO3: true,
      },
      path: "/socket",
    });
    return io;
  },

  getIO: () => {
    if (!io) {
      throw new Error("Socket not initialized");
    }
    return io;
  },

  addUser: (user) => {
    users.push(user);
  },

  getUsers: () => {
    return users;
  },

  addAdmin: (admin) => {
    admins.push(admin);
  },

  getAdmins: () => {
    return admins;
  },

  removeConnection: (_socketId) => {
    users = users.filter((user) => user.socketId !== _socketId);
    admins = admins.filter((admin) => admin.socketId !== _socketId);
  },
};
