const path = require("path");
const fs = require("fs");
const { request, response } = require("express");

const { uploadFile } = require("../helpers");

const {
   User: UserModel,
   Product: ProductModel,
} = require("../models");

// ? POST load file
const loadFile = async (req = request, res = response) => {
   //

   try {
      //   const name = await uploadFile(req.files, ["txt", "md"], 'texts');
      const name = await uploadFile(
         req.files,
         undefined,
         "imgs"
      );
      res.status(200).json({ name });

      //
   } catch (msg) {
      res.status(400).json({ msg });
   }
};

// ? PUt update image
const updateImage = async (req = request, res = response) => {
   //

   const { collection, id } = req.params;

   let model;
   switch (collection) {
      case "users":
         model = await UserModel.findById(id);
         if (!model)
            return res.status(400).json({
               msg: `the user with id: ${id} don't exist`,
            });

         break;
      case "products":
         model = await ProductModel.findById(id);
         if (!model)
            return res.status(400).json({
               msg: `the product with id: ${id} don't exist`,
            });

         break;

      default:
         return res.status(500).json({
            msg: "I forgot validate this",
         });
   }

   // * clear img prev
   if (model.image) {
      // * delete img
      const pathImage = path.join(
         __dirname,
         "../uploads",
         collection,
         model.image
      );
      if (fs.existsSync(pathImage)) fs.unlinkSync(pathImage);
   }

   // * get name of the image
   const name = await uploadFile(
      req.files,
      undefined,
      collection
   );
   model.image = name;

   // *save and send the image name
   await model.save();
   res.json({ collection, id, name });
};

// ? GET shwo image
const showImage = async (req = request, res = response) => {
   const { collection, id } = req.params;

   let model;

   switch (collection) {
      case "users":
         model = await UserModel.findById(id);
         if (!model)
            return res.status(400).json({
               msg: `the user with id: ${id} don't exist`,
            });

         break;

      case "products":
         model = await ProductModel.findById(id);
         if (!model)
            return res.status(400).json({
               msg: `the product with id: ${id} don't exist`,
            });

         break;

      default:
         return res.status(500).json({
            msg: "I forgot validate this",
         });
   }

   // * clear img prev
   if (model.image) {
      // * delete img
      const pathImage = path.join(
         __dirname,
         "../uploads",
         collection,
         model.image
      );
      if (fs.existsSync(pathImage))
         return res.sendFile(pathImage);
   }

   const noImagePath = path.join(
      __dirname,
      "../assets",
      "no-image.jpg.jpg"
   );
   res.sendFile(noImagePath);
};

module.exports = { showImage, loadFile, updateImage };
