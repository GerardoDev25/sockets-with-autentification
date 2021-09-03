// ? export all function the middleware
const validateJWT = require("../middlewares/validate-jwt.js");
const ValidataInputs = require("../middlewares/validate-inputs.js");
const validateRoles = require("../middlewares/validate-roles.js");
const validateFileUpload = require("./validate-file.js");

module.exports = {
   ...ValidataInputs,
   ...validateJWT,
   ...validateRoles,
   ...validateFileUpload,
};
