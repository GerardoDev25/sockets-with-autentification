const { response, request } = require("express");

const { Product: ProductsModel } = require("../models");

// ? GET all productos - public
const getProducts = async (req = request, res = response) => {
   try {
      // * get the params
      const { limit = 5, from = 0 } = req.params;
      const query = { state: true };

      // * get all products
      const [total, products] = await Promise.all([
         ProductsModel.countDocuments(query),
         ProductsModel.find(query)
            .populate("user", "name")
            .populate("categorie", "name")
            .skip(Number(from))
            .limit(Number(limit)),
      ]);

      // * send all products
      res.status(200).json({
         total,
         products,
      });
   } catch (error) {
      console.error(error);
      res.status(500).json(
         "Error in the database please talk with the admin"
      );
   }
};

// ? GET  productos by id - public
const getProduct = async (req = request, res = response) => {
   try {
      // * get the id param
      const { id } = req.params;

      // * find the product
      const product = await ProductsModel.findById(id)
         .populate("user", "name")
         .populate("categorie", "name");
      if (!product)
         return res
            .status(404)
            .json({ msg: `the product with id ${id} no exist` });

      // * send the product
      res.status(200).json({ product });
   } catch (error) {
      console.error(error);
      res.status(500).json(
         "Error in the database please talk with the admin"
      );
   }
};

// ? POST create product - private with token
const createProduct = async (req = request, res = response) => {
   try {
      const { state, user, ...data } = req.body;
      const name = req.body.name.toUpperCase();

      // * verify if the product exits
      const product = await ProductsModel.findOne({ name });
      if (product)
         return res.status(400).json({
            msg: `the product with the name: ${name} exist`,
         });

      // * generate the product
      const newData = {
         ...data,
         name,
         user: req.userAuth._id,
      };

      // * save product
      const newProduct = new ProductsModel(newData);
      await newProduct.save();
      res.status(201).json(newProduct);

      //
   } catch (error) {
      console.error(error);
      res.status(500).json(
         "Error in the database please talk with the admin"
      );
   }
};

// ? PUT update a product - private with token
const updateProduct = async (req = request, res = response) => {
   try {
      // * get params and data
      const { id } = req.params;
      const { state, user, ...data } = req.body;

      if (data.name) {
         data.name = data.name.toUpperCase();
      }

      data.user = req.userAuth._id;

      // * finad and update the product
      const product = await ProductsModel.findOneAndUpdate(
         id,
         data,
         { new: true }
      );

      // * send the prouduct
      res.status(200).json({ product });

      //
   } catch (error) {
      console.error(error);
      res.status(500).json(
         "Error in the database please talk with the admin"
      );
   }
};

// ? DELETE a product - private only admin
const dateteProduct = async (req = request, res = response) => {
   try {
      // * get params
      const { id } = req.params;

      // * find and update the state
      const product = await ProductsModel.findByIdAndUpdate(
         id,
         { state: false },
         { new: true }
      );

      // *send the product
      res.status(200).json({ product });

      //
   } catch (error) {
      console.error(error);
      res.status(500).json(
         "Error in the database please talk with the admin"
      );
   }
};

module.exports = {
   getProducts,
   getProduct,
   createProduct,
   updateProduct,
   dateteProduct,
};
