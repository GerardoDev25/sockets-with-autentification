const urlLocal = "http://localhost:8080/api/auth";
const url = "http://localhost:8080/api/auth/google";

let user = null;
let socket = null;

const $txtUid = document.querySelector("#txtUid");
const $txtMsg = document.querySelector("#txtMsg");
const $ulUsers = document.querySelector("#ulUsers");
const $ulMessages = document.querySelector("#ulMessages");
const $btnExit = document.querySelector("#btnExit");

const drawUsers = (users = []) => {
   let htmlUsers = "";
   users.forEach(({ name, uid }) => {
      htmlUsers += `
      <l1>
         <p>
            <h5 class="text-success">${name}</h5>
            <span class="fs-6 text-muted">${uid}</span=>
         </p>
      </l1>
      `;
   });

   $ulUsers.innerHTML = htmlUsers;
};

// ? concciton of the socket
const socketConnection = async () => {
   socket = io({
      extraHeaders: {
         "x-token": localStorage.getItem("token"),
      },
   });

   socket.on("connect", () => {
      console.log("socket online");
   });

   socket.on("disconnect", () => {
      console.log("socket offline");
   });

   socket.on("get-messages", () => {});

   socket.on("users-actives", drawUsers);

   socket.on("message-private", () => {});
};

// ? function that valid the JWT
const validateJWT = async () => {
   const token = localStorage.getItem("token") || "";
   if (token.length <= 10) {
      window.location = "index.html";
      throw new Error("token no valid");
   }

   const resp = await fetch(urlLocal, {
      headers: {
         "x-token": token,
      },
   });

   const { userAuth, token: tokenDB } = await resp.json();

   user = userAuth;
   localStorage.setItem("token", tokenDB);
   document.title = user.name;

   await socketConnection();
};

const main = async () => {
   await validateJWT();
};

main();
