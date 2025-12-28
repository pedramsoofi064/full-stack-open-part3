const express = require("express");
const morgan = require("morgan");
const app = express();
app.use(express.json());

morgan.token("req-body", function (req, res) {
  if (!req.body) return "";
  return JSON.stringify(req.body)
});

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :req-body"
  )
);

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1,
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2,
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3,
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4,
  },
];

app.get("/info", (request, response) => {
  response.send(`
        <p>Phonebook has info for ${persons.length} people.</p>
        <p>${new Date()}</p>
    `);
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const { id } = request.params;

  const person = persons.find((item) => item.id === id);

  if (!person) return response.status(404).end();

  response.json(person);
});

app.delete("/api/persons/:id", (request, response) => {
  const { id } = request.params;

  
  const person = persons.find((item) => item.id == id);
  if (!person) return response.status(404).end();
  persons = persons.filter((item) => item.id != id);  
  response.status(202).end(0);
});

app.post("/api/persons", (request, response) => {
  const { name, number } = request.body;

  if (!name || !number)
    response.status(400).send({
      error: "name or number are missed",
    });

  if (persons.some((item) => item.name === name))
    response.status(400).send({
      error: "name must be unique",
    });

  const id = Math.floor(1000 + Math.random() * 9000);
  const payload = {
    id,
    name,
    number,
  };
  persons.push(payload);

  response.json(payload);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
