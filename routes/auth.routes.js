const { Router } = require("express");
const { check } = require("express-validator");

// * middleware
const {
   ValidataInputs,
} = require("../middlewares/validate-inputs");

// * controllers
const {
   login,
   gogleSignIn,
} = require("../controllers/auth.controller");

// ! ----------------------------------------------------

const router = Router();

// ? POST
router.post(
   "/login",
   [
      check("email", "the email is required").isEmail(),
      check("password", "the password is required")
         .not()
         .isEmpty(),
      ValidataInputs,
   ],
   login
);

// ? POST GOOGLE
router.post(
   "/google",
   [
      check("id_token", "the id_token is required")
         .not()
         .isEmpty(),
      ValidataInputs,
   ],
   gogleSignIn
);

module.exports = router;
