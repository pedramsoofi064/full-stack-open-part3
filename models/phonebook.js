const mongoose = require("mongoose");

const MONGO_URL = process.env.MONGODB_URI;

mongoose.set("strictQuery", false);

mongoose.connect(MONGO_URL, { family: 4 });

const phoneBookSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
    unique: true
  },
  number: {
    type: String,
    minLength: 8,
    required: true,
    validate: {
      validator: function(v) {
        return /^(?:\d{2}|\d{3})-\d+$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    },
  },
});

phoneBookSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Phonebook", phoneBookSchema);
