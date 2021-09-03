const { Schema, model } = require("mongoose");

const ProductSchema = Schema({
   name: {
      type: String,
      required: [true, "the name is required"],
   },
   state: {
      type: Boolean,
      default: true,
      required: true,
   },
   user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
   },
   category: {
      type: Schema.Types.ObjectId,
      ref: "Categorie",
      required: true,
   },
   price: {
      type: Number,
      dafault: 0,
   },
   description: {
      type: String,
   },
   image: {
      type: String,
   },
   available: {
      type: Boolean,
      default: true,
   },
});

// ? rewrite a functin to remove password and version
ProductSchema.methods.toJSON = function () {
   const { __v, state, _id, ...data } = this.toObject();
   return { uid: _id, ...data };
};

module.exports = model("Product", ProductSchema);
