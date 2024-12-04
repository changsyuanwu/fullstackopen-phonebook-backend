require("@dotenvx/dotenvx").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person")

morgan.token("body", function (req, res) {
  return JSON.stringify(req.body);
});

const app = express();
app.use(express.static("dist"));
app.use(express.json());
app.use(cors());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

let persons = [];

app.get("/api/persons", (req, res, next) => {
  Person.find({}).then(persons => {
    res.json(persons);
  })
});

app.post("/api/persons", (req, res, next) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "name or number missing",
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number
  });

  person
    .save()
    .then((result) => {
      console.log(`added ${result.name} number ${result.number} to phonebook`);
    })
    .catch((err) => next(err));
});

app.get("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  Person.findById(id)
    .then((p) => {
      res.json(p);
    })
    .catch((err) => next(err));
});

app.delete("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  Person.findByIdAndDelete(id)
    .then((result) => {
      if (result) res.status(200).json(result);
      else res.status(204).end();
    })
    .catch((err) => next(err));
});

app.put("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;

  const body = req.body;
  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(id, person, { new: true })
    .then((updatedNote) => {
      res.json(updatedNote);
    })
    .catch(err => next(err));
})

app.get("/api/info", (req, res) => {
  const date = new Date().toString();
  Person.find({})
    .then((persons) => {
      res.send(
        `<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`
      );
    })
    .catch((err) => next(err));
});

const errorHandler = (err, req, res, next) => {
  console.error(err.message);

  if (err.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  }
  else if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  }

  next(err);
};
// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler);