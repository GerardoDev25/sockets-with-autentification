const cors = require("cors");
const express = require("express");
const fileUpload = require("express-fileupload");

const { dbConnection } = require("../database/config.js");

const {
   socketController,
} = require("../sockets/sockets.controller.js");

class Server {
   constructor() {
      this.port = process.env.PORT;
      this.app = express();

      // * sockets
      this.server = require("http").createServer(this.app);
      this.io = require("socket.io")(this.server);

      // * paths
      this.paths = {
         user: "/api/users",
         auth: "/api/auth",
         categories: "/api/categories",
         products: "/api/products",
         search: "/api/search",
         uploads: "/api/uploads",
      };

      // * connect to database
      this.connectDB();

      // * middlewares
      this.middlewares();

      // * routes
      this.routes();

      // * sockets
      this.sockets();
   }

   async connectDB() {
      await dbConnection();
   }

   // ? function that contains all middlewares of the app
   middlewares() {
      // * cors
      this.app.use(cors());

      // * read and body parse
      this.app.use(express.json());

      // * public directory
      this.app.use(express.static("public"));

      // * handle file Upload
      this.app.use(
         fileUpload({
            useTempFiles: true,
            tempFileDir: "/tmp/",
            createParentPath: true,
         })
      );
   }

   // ? function that handle the routes of the app
   routes() {
      this.app.use(
         this.paths.user,
         require("../routes/users.routes.js")
      );

      this.app.use(
         this.paths.auth,
         require("../routes/auth.routes.js")
      );

      this.app.use(
         this.paths.categories,
         require("../routes/categories.routes.js")
      );

      this.app.use(
         this.paths.products,
         require("../routes/products.routes.js")
      );

      this.app.use(
         this.paths.search,
         require("../routes/search.routes.js")
      );

      this.app.use(
         this.paths.uploads,
         require("../routes/upload.routes.js")
      );
   }

   // ? sockets configuration
   sockets() {
      this.io.on("connection", socketController);
   }

   // ? funtion that listen the app in the port
   listen() {
      this.server.listen(this.port, () => {
         console.log("server run in port ", this.port);
      });
   }
}

module.exports = Server;
