require("colors");
const mongoose = require("mongoose");

// ? funtion that conect with the data base
const dbConnection = async () => {
   try {
      await mongoose.connect(process.env.MONGODB_CNN, {
         useNewUrlParser: true,
         useUnifiedTopology: true,
         useCreateIndex: true,
         useFindAndModify: true,
      });

      console.log("db online".green);
   } catch (error) {
      console.log(error);
      throw new Error("Error to start data base".red);
   }
};

module.exports = { dbConnection };
