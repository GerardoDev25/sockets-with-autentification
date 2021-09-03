const validateFileUpload = (req, res, next) => {
   // * if come a file property in the request
   if (
      !req.files ||
      Object.keys(req.files).length === 0 ||
      !req.files.file
   )
      return res
         .status(400)
         .json({ msg: "No files were uploaded - file." });

   next();
};

module.exports = {
   validateFileUpload,
};
