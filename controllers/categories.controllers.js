const { request, response } = require("express");

// * models
const { Category: CategoryModel } = require("../models");

// ? GET all
const getCategories = async (req = request, res = response) => {
   //
   // * get the paramas for the pagination
   const { limit = 5, from = 0 } = req.query;
   const query = { state: true };

   // * get categories with pagination
   const [total, categories] = await Promise.all([
      CategoryModel.countDocuments(query),
      CategoryModel.find(query)
         .skip(Number(from))
         .limit(Number(limit)),
   ]);

   req.res.json({ total, categories });
};

// ? GET one
const getCategory = async (req = request, res = response) => {
   const { id } = req.params;

   const category = await CategoryModel.findById(id);
   if (!category) {
      return res.status(404).json({
         msg: `the category with id ${id} isn't exist`,
      });
   }
   res.status(200).json({
      category,
   });
};

// ? POST
const createCategory = async (req = request, res = response) => {
   const name = req.body.name.toUpperCase();

   const categoryDB = await CategoryModel.findOne({ name });

   if (categoryDB) {
      return res.status(400).json({
         msg: `the category ${categoryDB.name} exist!!`,
      });
   }

   // * generate data
   const data = { name, user: req.userAuth._id };

   // * save category
   const category = new CategoryModel(data);
   await category.save();
   res.status(201).json(category);
};

// ? PUT
const updateCategory = async (req = request, res = response) => {
   const { id } = req.params;

   const category = await CategoryModel.findById(id);
   if (category) {
      return res.status(400).json({
         msg: `the category ${category.name} exist!!`,
      });
   }
};

// ? DELETE
const deleteCategory = async (req = request, res = response) => {
   const { id } = req.params;

   // * change the status to false
   const categoryDelete = await CategoryModel.findByIdAndUpdate(
      id,
      {
         state: false,
      }
   );

   // * send category changed
   res.json({
      categoryDelete,
   });
};

module.exports = {
   createCategory,
   getCategories,
   deleteCategory,
   getCategory,
   updateCategory,
};
