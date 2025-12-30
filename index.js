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

app.get("/api/persons/:id", (request, response, next) => {
  const { id } = request.params;

  Phonebook.findById(id)
    .then((res) => {
      if (!res) {
        response.status(404).send({
          error: "Not Found",
        });
      } else response.json(res);
    })
    .catch(() => next());
});

app.delete("/api/persons/:id", (request, response) => {
  const { id } = request.params;

  Phonebook.findByIdAndDelete(id)
    .then((res) => {
      if (!res) {
        response.status(404).send({
          error: "Not Found",
        });
      }
      response.status(204).end(0);
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (request, response, next) => {
  const { name, number } = request.body;

  const person = new Phonebook({
    name,
    number,
  });

  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson);
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const { name, number } = request.body;
  const person = {
    name,
    number,
  };
  Phonebook.findByIdAndUpdate(request.params.id, person, {
    new: true,
    runValidators: true,
  })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
