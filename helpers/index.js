const dbValidator = require("./dbValidators");
const generateJWT = require("./generateJWT");
const googleVerify = require("./google-verify");
const uploadFile = require("./upload-file");

module.exports = {
   ...dbValidator,
   ...generateJWT,
   ...googleVerify,
   ...uploadFile,
};
