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
   console.log(token);
   try {
      if (token.length <= 10) return null;
      const { uid } = jwt.verify(
         token,
         process.env.SECRETORPRIVATEKEY
      );

      console.log(uid);
      // console.log(uid);

      // const user = UserModel.findById(uid);

      // if (user)
      //    if (user.state) return user;
      //    else return null;
      // else return null;

      //
   } catch (error) {
      return null;
   }
};

module.exports = { generateJWT, checkJWT };
