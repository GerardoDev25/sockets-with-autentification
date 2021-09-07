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
   io.emit("get-messages", chatMessage.last10);

   // * connect to private living room
   socket.join(user._id);

   socket.on("disconnect", () => {
      chatMessage.userDisconnect(user._id);
      io.emit("users-actives", chatMessage.usersArr);
   });

   socket.on("send-message", ({ message, uid }) => {
      if (uid) {
         // * private message 
         socket.to(uid).emit("message-private", {
            from: user.name,
            message,
         });
      } else {
         chatMessage.sendMessage(user._id, user.name, message);
         io.emit("get-messages", chatMessage.last10);
      }
   });
};

module.exports = { socketController };
