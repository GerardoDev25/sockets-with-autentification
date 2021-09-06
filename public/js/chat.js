const urlLocal = "http://localhost:8080/api/auth";
const url = "http://localhost:8080/api/auth/google";

let user = null;
let socket = null;


// ? concciton of the socket
const socketConnection = async () => {
   const socket = io({
      extraHeaders: {
         "x-token": localStorage.getItem("token"),
      },
   });
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
