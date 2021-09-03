const jwt = require("jsonwebtoken");
const { response, request } = require("express");

const UserModel = require("../models/user");

const validateJWT = async (
   req = request,
   res = response,
   next
) => {
   const token = req.header("x-token");

   // * if there is no token
   if (!token)
      return res
         .status(401)
         .json({ msg: "there is no token in the request" });

   // * validate token
   try {
      const { uid } = jwt.verify(
         token,
         process.env.SECRETORPRIVATEKEY
      );

      // * get user auth
      const userAuth = await UserModel.findById(uid);
      if (!userAuth) {
         return res.status(401).json({
            msg: "Error user doesn't exist in the database",
         });
      }
      
      // * verify if userAuth is active
      if (!userAuth.state) {
         return res.status(401).json({
            msg: "token isn't valid - user with state on false",
         });
      }
      
      // * return user auth
      req.userAuth = userAuth;

      next();
   } catch (error) {
      console.error(error);
      res.status(401).json({
         msg: "token isn't valid",
      });
   }
};

module.exports = { validateJWT };
