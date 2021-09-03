const { Router } = require("express");
const { check } = require("express-validator");

// * middlewares
const {
   ValidataInputs,
   validateJWT,
   isAdminRole,
   haveRole,
} = require("../middlewares");

// * helpers
const {
   isValidRole,
   existEmail,
   existUserId,
} = require("../helpers/dbValidators.js");

// * controllers
const {
   userGet,
   userPost,
   userPut,
   userDelete,
   userPatch,
} = require("../controllers/users.controllers.js");

// ! -----------------------------------------------------

const router = Router();

// ? GET
router.get("/", userGet);

// ? POST
router.post(
   "/",
   [
      check("name", "the name is required").not().isEmpty(),
      check("email", "the email isn't valid").isEmail(),
      check("email").custom(existEmail),
      check("role").custom(isValidRole),
      check(
         "password",
         "the password is mandatory and must have more than 6 letters"
      ).isLength({ min: 6 }),
      ValidataInputs,
   ],
   userPost
);

// ? PUT
router.put(
   "/:id",
   [
      check("id", "isn't valid id").isMongoId(),
      check("id").custom(existUserId),
      check("role").custom(isValidRole),
      ValidataInputs,
   ],
   userPut
);

// ? DELETE
router.delete(
   "/:id",
   [
      validateJWT,
      // isAdminRole,
      haveRole("ADMIN_ROLE", "SELL_ROLE"),
      check("id", "isn't valid id").isMongoId(),
      check("id").custom(existUserId),
      ValidataInputs,
   ],
   userDelete
);

// ? PATCH
router.patch("/", userPatch);

module.exports = router;
