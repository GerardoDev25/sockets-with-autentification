const { Socket } = require("socket.io");
const { checkJWT } = require("../helpers");
const { ChatMessage } = require("../models");

const chatMessage = new ChatMessage();

const socketController = async (socket = new Socket(), io) => {
   //

   const token = socket.handshake.headers["x-token"];
   const user = await checkJWT(token);

   if (!user) return socket.disconnect();

   chatMessage.userConnect(user);
   io.emit("users-actives", chatMessage.usersArr);

   socket.on("disconnect", () => {
      chatMessage.userDisconnect(user._id);
      io.emit("users-actives", chatMessage.usersArr);
   });

   socket.on("send-message", ({ message, uid }) => {
      chatMessage.sendMessage(user._id, user.name, message);
      io.emit("get-messages", chatMessage.last10);
   });
};

module.exports = { socketController };
