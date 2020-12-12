const _socket = require("socket.io");
const { newMessage } = require("./firebase");

let users = {};
let id_users = {};
let userNames = [];

function connect(server) {
  const io = _socket(server, { cors: { origins: "*:*" } });

  io.on("connection", (socket) => {
    console.log("[CONN] User Conected with id", socket.id);
    socket.on("disconnect", () => {
      console.log(
        "[DISCONN] User disconnected with id",
        socket.id,
        id_users[socket.id]
      );
      const temp = id_users[socket.id];
      delete users[temp];
      userNames.splice(userNames.indexOf(temp), 1);
      delete id_users[socket.id];
    });

    socket.on("joined", (data) => {
      users[data.name] = socket.id;
      id_users[socket.id] = data.name;
      userNames.push(data.name);
      socket.emit("joined-confirm", { status: "success" });
    });

    socket.on("new-message", async (data) => {
      const from = id_users[socket.id];
      const to = users[data.to];
      if (userNames.includes(data.to)) {
        io.to(to).emit("r-msg", {
          msg: data.msg,
          from: from,
          time: data.time,
        });
      } else {
        console.log("not-connected");
      }

      await newMessage(from, data.to, data.msg, data.time, "sent");
      await newMessage(data.to, from, data.msg, data.time, "received");
    });
  });
}

module.exports = connect;
