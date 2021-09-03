const { response, request } = require("express");
const { ObjectId } = require("mongoose").Types;

// ? models
const {
   User: UserModel,
   Category: CategoryModel,
   Product: ProductModel,
} = require("../models");

// ! ----------------------------------------------------

// ? collections for search
const collections = ["users", "categories", "products", "roles"];

// ? search user
const searchUsers = async (term, res = response) => {
   const isMondoId = ObjectId.isValid(term);

   // * search by id
   if (isMondoId) {
      const user = await UserModel.findById(term);
      return res
         .status(200)
         .json({ results: user ? [user] : [] });
   }

   // * serach by name or email
   const regex = new RegExp(term, "i");
   const conditions = {
      $or: [{ name: regex }, { email: regex }],
      $and: [{ state: true }],
   };

   const [total, users] = await Promise.all([
      UserModel.count(conditions),
      UserModel.find(conditions),
   ]);

   // * send results
   res.status(200).json({ total, results: users });
};

// ? search categories
const searchCategories = async (term, res = response) => {
   // * search by id
   if (ObjectId.isValid(term)) {
      const users = await CategoryModel.findById(term);
      return res
         .status(200)
         .json({ results: users ? [users] : [] });
   }

   // * search by name
   const regex = new RegExp(term, "i");
   const conditions = {
      $or: [{ name: regex }],
      $and: [{ state: true }],
   };
   const [total, categories] = await Promise.all([
      CategoryModel.count(conditions),
      CategoryModel.find(conditions),
   ]);

   // * send results
   res.status(200).json({ total, results: categories });
};

// ? search products
const searchProducts = async (term, res = response) => {
   // * serach by id
   if (ObjectId.isValid(term)) {
      const products = await ProductModel.findById(
         term
      ).populate("categorie", "name");
      return res.status(200).json({
         results: products ? [products] : [],
      });
   }

   // * search by name and description
   const regex = new RegExp(term, "i");
   const conditions = {
      $or: [{ name: regex }, { description: regex }],
      $and: [{ state: true }],
   };

   const [total, products] = await Promise.all([
      ProductModel.count(conditions),
      ProductModel.find(conditions).populate(
         "categorie",
         "name"
      ),
   ]);

   // * send resuts
   res.status(200).json({ total, results: products });
};

// ? Get serach products and categories
const search = (req = request, res = response) => {
   const { collection, term } = req.params;

   if (!collections.includes(collection))
      return res.status(400).json({
         msg: `the allowed collections are ${collections}`,
      });

   switch (collection) {
      case collections[0]:
         searchUsers(term, res);
         break;

      case collections[1]:
         searchCategories(term, res);
         break;

      case collections[2]:
         searchProducts(term, res);
         break;

      // * if the term isn't match 
      default:
         res.status(500).json({
            msg: "I forgot to do this search",
         });

         break;
   }
};

module.exports = { search };
