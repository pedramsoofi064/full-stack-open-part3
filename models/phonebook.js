const mongoose = require("mongoose");

const MONGO_URL = process.env.MONGODB_URI;

mongoose.set("strictQuery", false);

mongoose.connect(MONGO_URL, { family: 4 });

const phoneBookSchema = new mongoose.Schema({
  name: String,
  number: String,
});

phoneBookSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Phonebook", phoneBookSchema);
