const { request, response } = require("express");

const { Category: CategoryModel } = require("../models");

// ? GET all
const getCategories = async (req = request, res = response) => {
   //
   try {
      // * get the paramas for the pagination
      const { limit = 5, from = 0 } = req.query;
      const query = { state: true };

      // * get categories with pagination
      const [total, categories] = await Promise.all([
         CategoryModel.countDocuments(query),
         CategoryModel.find(query)
            .populate("user", "name")
            .skip(Number(from))
            .limit(Number(limit)),
      ]);

      res.status(200).json({ total, categories });
   } catch (error) {
      console.error(error);
      res.status(500).json(
         "Error in the database please talk with the admin"
      );
   }
};

// ? GET one
const getCategory = async (req = request, res = response) => {
   try {
      const { id } = req.params;

      const category = await CategoryModel.findById(id).populate(
         "user",
         "name"
      );
      if (!category) {
         return res.status(404).json({
            msg: `the category with id ${id} isn't exist`,
         });
      }
      res.status(200).json({
         category,
      });
   } catch (error) {
      console.error(error);
      res.status(500).json(
         "Error in the database please talk with the admin"
      );
   }
};

// ? POST
const createCategory = async (req = request, res = response) => {
   try {
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
   } catch (error) {
      console.error(error);
      res.status(500).json(
         "Error in the database please talk with the admin"
      );
   }
};

// ? PUT
const updateCategory = async (req = request, res = response) => {
   try {
      const { id } = req.params;

      const { state, user, ...data } = req.body;
      data.name = data.name.toUpperCase();
      data.user = req.userAuth._id;

      const category = await CategoryModel.findByIdAndUpdate(
         id,
         data,
         { new: true }
      );

      res.status(200).json({ category });
   } catch (error) {
      console.error(error);
      res.status(500).json(
         "Error in the database please talk with the admin"
      );
   }
};

// ? DELETE
const deleteCategory = async (req = request, res = response) => {
   try {
      const { id } = req.params;

      // * change the status to false
      const categoryDelete =
         await CategoryModel.findByIdAndUpdate(
            id,
            {
               state: false,
            },
            { new: true }
         );

      // * send category changed
      res.status(200).json({
         categoryDelete,
      });
   } catch (error) {
      console.error(error);
      res.status(500).json(
         "Error in the database please talk with the admin"
      );
   }
};

module.exports = {
   createCategory,
   getCategories,
   deleteCategory,
   getCategory,
   updateCategory,
};
