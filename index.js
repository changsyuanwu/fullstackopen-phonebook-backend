const express = require("express");
const app = express();

app.use(express.json());

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