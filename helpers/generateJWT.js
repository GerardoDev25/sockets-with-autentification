const jwt = require("jsonwebtoken");
const { User: UserModel } = require("../models");

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

const checkJWT = async (token = "") => {
   // console.log("createJWT: ", token);
   try {
      if (token.length <= 10) return null;
      const { uid } = jwt.verify(
         token,
         process.env.SECRETORPRIVATEKEY
      );

      const user = await UserModel.findById(uid);

      if (user && user.state) return user;
      return null;

      //
   } catch (error) {
      return null;
   }
};

module.exports = { generateJWT, checkJWT };
