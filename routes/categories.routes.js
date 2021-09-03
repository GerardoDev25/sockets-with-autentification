const { Router } = require("express");
const { check } = require("express-validator");

// * controllers
const {
   createCategory,
   getCategories,
   deleteCategory,
   getCategory,
   updateCategory,
} = require("../controllers/categories.controller");

// * helpers
const { existcategoryId } = require("../helpers/dbValidators");

// * middleware
const {
   validateJWT,
   ValidataInputs,
   isAdminRole,
   haveRole,
} = require("../middlewares");

// ! ----------------------------------------------------

const router = Router();

// ? GET all categories - public
router.get("/", getCategories);

// ? GET one category by id - public
router.get(
   "/:id",
   [
      check("id", "the id is requerid").isMongoId(),
      check("id").custom(existcategoryId),
      ValidataInputs,
   ],
   getCategory
);

// ? POST create a category - private with token
router.post(
   "/",
   [
      validateJWT,
      haveRole("ADMIN_ROLE", "SELL_ROLE"),
      check("name", "the name is required").not().isEmpty(),
      ValidataInputs,
   ],
   createCategory
);

// ? PUT update - private with token
router.put(
   "/:id",
   [
      validateJWT,
      check("id", "the id is requerid").not().isEmpty(),
      check("id").custom(existcategoryId),
      check("name", "the name is requerid").not().isEmpty(),
      haveRole("ADMIN_ROLE", "SELL_ROLE"),
      ValidataInputs,
   ],
   updateCategory
);

// ? DELETE delete a category - only admin
router.delete(
   "/:id",
   [
      check("id", "the id is not valid").isMongoId(),
      check("id").custom(existcategoryId),
      validateJWT,
      isAdminRole,
      ValidataInputs,
   ],
   deleteCategory
);

module.exports = router;
