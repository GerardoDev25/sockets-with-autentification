const { Schema, model } = require("mongoose");

const UserSchema = Schema({
   name: {
      type: String,
      required: [true, "the name is required"],
   },
   email: {
      type: String,
      required: [true, "the email is required"],
      unique: true,
   },
   password: {
      type: String,
      required: [true, "the password is required"],
   },
   image: {
      type: String,
   },
   role: {
      type: String,
      required: true,
      default: "USER_ROLE",
      // enum: ["ADMIN_ROLE", "USER_ROLE"],
   },
   state: {
      type: Boolean,
      default: true,
   },
   google: {
      type: Boolean,
      default: false,
   },
});

// ? rewrite a functin to remove password and version
UserSchema.methods.toJSON = function () {
   const { __v, password, _id, ...users } = this.toObject();
   return { ...users, uid: _id };
};

module.exports = model("User", UserSchema);
