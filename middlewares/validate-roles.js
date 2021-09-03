const { response, request } = require("express");

// ? function that verify if the user is admin
const isAdminRole = (req = request, res = response, next) => {
   if (!req.userAuth)
      return res
         .status(500)
         .json({
            msg: "you want to verify the role without validating the token first",
         });

   const { role, name } = req.userAuth;

   if (role !== "ADMIN_ROLE")
      return res
         .status(401)
         .json({ msg: `the user: ${name} isn't admin` });

   next();
};

// ? function that verify if the user have tle roles
const haveRole = (...roles) => {
   return (req, res, next) => {
      // * verity if the user exits
      if (!req.userAuth)
         return res.status(500).json({
            msg: "you want to verify the role without validating the token first",
         });

      const { role } = req.userAuth;

      // * verify if the user have one role
      if (!roles.includes(role)) {
         return res.status(401).json({
            msg: `the service require one the this roles ${roles}`,
         });
      }
      next();
   };
};

module.exports = {
   isAdminRole,
   haveRole,
};
