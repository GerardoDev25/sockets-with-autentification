const { Socket } = require("socket.io");
const { checkJWT } = require("../helpers");

const socketController = async (socket = new Socket()) => {
   //

   const token = socket.handshake.headers["x-token"];
   const user = await checkJWT(token);

   if (!user) return socket.disconnect();
   console.log("se conecto: " + user.name);
};

module.exports = { socketController };
