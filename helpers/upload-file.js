const path = require("path");
const { v4: uuidv4 } = require("uuid");

const uploadFile = (
   files,
   extensionsValid = ["png", "jpg", "jpeg", "gif"],
   folder = ""
) => {
   return new Promise((resolve, reject) => {
      //

      const { file } = files;

      // * get extencion
      const cutName = file.name.split(".");
      const extension = cutName[cutName.length - 1];

      // * velidate extension of file
      if (!extensionsValid.includes(extension))
         return reject(`extension ${extension} invalid`);

      // * create path of the file
      const nameTemp = uuidv4() + "." + extension;
      const uploadPath = path.join(
         __dirname,
         "../uploads/",
         folder,
         nameTemp
      );

      // * uploading the file
      file.mv(uploadPath, (err) => {
         if (err) return reject(err);

         resolve(nameTemp);
      });
   });
};

module.exports = {
   uploadFile,
};
