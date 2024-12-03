const express = require("express");
const { v4: uuidv4 } = require("uuid");
const morgan = require("morgan");

const app = express();
app.use(express.json());

morgan.token("body", function (req, res) {
  return JSON.stringify(req.body);
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "name or number missing",
    });
  }

  if (persons.find(p => p.name === body.name)) {
    return res.status(400).json({
      error: "name must be unique"
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: uuidv4()
  }

  persons = persons.concat(person)

  res.json(person)
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find(p => p.id === id);
  if (person)
    response.json(person);
  else
    response.status(404).end()
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = persons.find((p) => p.id === id);
  persons = persons.filter(p => p.id !== id);
  res.status(200).json(person)
})

app.get("/api/info", (req, res) => {
  const date = new Date().toString();
  res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`)
})

