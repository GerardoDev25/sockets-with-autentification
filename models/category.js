const { Schema, model } = require("mongoose");

const CategorySchema = Schema({
   name: {
      type: String,
      required: [true, "the name is required"],
      // unique: true,
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
});

// ? rewrite a functin to remove password and version
CategorySchema.methods.toJSON = function () {
   const { __v, state, _id, ...data } = this.toObject();
   return { uid: _id, ...data };
};

module.exports = model("Categorie", CategorySchema);
