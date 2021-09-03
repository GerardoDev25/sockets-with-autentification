const { response, request } = require("express");
const bcryptjs = require("bcryptjs");

// * models
const UserModel = require("../models/user");

// * helpers
const { generateJWT } = require("../helpers/generateJWT");
const { googleVerify } = require("../helpers/google-verify");

// ! -----------------------------------------------------

// ? funtion that make login
const login = async (req = request, res = response) => {
   const { email, password } = req.body;

   try {
      // * veriry if the eamil exist
      const user = await UserModel.findOne({ email });
      if (!user) {
         return res.status(400).json({
            msg: "user or password isn't correct ¿ email",
         });
      }

      // * veriry if the user is active
      if (!user.state) {
         return res.status(400).json({
            msg: "user or password isn't correct ¿ state",
         });
      }

      // * veriry the password
      const validPassword = bcryptjs.compareSync(
         password,
         user.password
      );
      if (!validPassword) {
         return res.status(400).json({
            msg: "user or password isn't correct ¿ password",
         });
      }

      // * generate and send token
      const token = await generateJWT(user.id);
      res.json({ user, token });

      //
   } catch (error) {
      console.error(error);
      res.status(500).json({
         msg: "something went wrong, please talk with the admin",
      });
   }
};

// ? funtion that make login with google
const gogleSignIn = async (req = request, res = response) => {
   const { id_token } = req.body;

   try {
      const { email, name, image } = await googleVerify(
         id_token
      );

      // * get user
      let user = await UserModel.findOne({ email });

      // * if no exist the user create one
      if (!user) {
         const data = {
            name,
            email,
            password: "no_importa",
            image,
            google: true,
         };

         // * save the new user in to data base
         user = new UserModel(data);
         await user.save();
      }

      // * if user db isn't active 
      if (!user.state) {
         return res
            .status(401)
            .json({ msg: "talk to the admin - user locked" });
      }

      // * generate jwt
      const token = await generateJWT(user.id);

      res.json({ user, token });
   } catch (error) {
      console.log(error);
      res.status(400).json({
         msg: "google token isn't valid",
      });
   }
};

module.exports = { login, gogleSignIn };
