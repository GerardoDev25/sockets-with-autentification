const { response, request } = require("express");
const bcryptjs = require("bcryptjs");

const UserModel = require("../models/user");

// ? GET
const userGet = async (req = request, res = response) => {
   //
   // * get the paramas for the pagination
   const { limit = 5, from = 0 } = req.query;
   const query = { state: true };

   // * get users with pagination
   const [total, users] = await Promise.all([
      UserModel.countDocuments(query),
      UserModel.find(query)
         .skip(Number(from))
         .limit(Number(limit)),
   ]);

   req.res.json({ total, users });
};

// ? POST
const userPost = async (req = request, res = response) => {
   const { name, email, password, role } = req.body;

   const user = new UserModel({ name, email, password, role });

   // * encode the password
   const salt = bcryptjs.genSaltSync();
   user.password = bcryptjs.hashSync(password, salt);

   // * save the user to data base
   await user.save();

   res.json({
      msg: "post API - contralador",
      user,
   });
};

// ? PUT
const userPut = async (req = request, res = response) => {
   const { id } = req.params;
   const { _id, password, google, email, ...resto } = req.body;

   // todo valida db

   if (password) {
      // * encode the password
      const salt = bcryptjs.genSaltSync();
      resto.password = bcryptjs.hashSync(password, salt);
   }

   const userDB = await UserModel.findByIdAndUpdate(id, resto);

   res.status(200).json(userDB);
};

// ? DELETE
const userDelete = async (req = request, res = response) => {
   const { id } = req.params;

   // const user = await UserModel.findByIdAndDelete(id);

   // * change the status to false
   const userDelete = await UserModel.findByIdAndUpdate(id, {
      state: false,
   });

   // * send user changed
   res.json({
      userDelete,
   });
};

// ? PATCH
const userPatch = (req = request, res = response) => {
   res.json({
      msg: "patch API - contralador",
   });
};

// export
module.exports = {
   userGet,
   userPost,
   userPut,
   userDelete,
   userPatch,
};
