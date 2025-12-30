const express = require("express");
const morgan = require("morgan");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.static("dist"));

const Phonebook = require("./models/phonebook.js");

morgan.token("req-body", function (req, res) {
  if (!req.body) return "";
  return JSON.stringify(req.body);
});

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :req-body"
  )
);

app.get("/info", (request, response) => {
  Phonebook.countDocuments({}).then((res) => {
    response.send(`
        <p>Phonebook has info for ${res} people.</p>
        <p>${new Date()}</p>
    `);
  });
});

app.get("/api/persons", (request, response) => {
  Phonebook.find({}).then((res) => {
    console.log("phonebook:");
    response.send(res);
  });
});

app.get("/api/persons/:id", (request, response) => {
  const { id } = request.params;

  Phonebook.findById(id).then((res) => {
    if (!res) {
      response.status(404).send({
        error: "Not Found",
      });
    } else response.json(res);
  });
});

app.delete("/api/persons/:id", (request, response) => {
  const { id } = request.params;

  Phonebook.deleteOne({ _id: id }).then((res) => {
    if (!res.deletedCount) {
      response.status(404).send({
        error: "Not Found",
      });
    }
    response.status(202).end(0);
  });
});

app.post("/api/persons", (request, response) => {
  const { name, number } = request.body;

  if (!name || !number)
    response.status(400).send({
      error: "name or number are missed",
    });

  const person = new Phonebook({
    name,
    number,
  });

  person.save().then((result) => {
    response.json(result);
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
