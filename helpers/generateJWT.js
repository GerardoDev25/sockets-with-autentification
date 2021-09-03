const jwt = require("jsonwebtoken");

const generateJWT = (uid = "") =>
   new Promise((resolve, reject) => {
      const payload = { uid };

      // * generate jwt
      jwt.sign(
         payload,
         process.env.SECRETORPRIVATEKEY,
         {
            expiresIn: "4h",
         },
         (err, token) => {
            if (err) {
               console.error(err);
               reject("Error to generate jwt");
            } else resolve(token);
         }
      );
   });

module.exports = { generateJWT };
