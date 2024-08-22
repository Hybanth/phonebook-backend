require('dotenv').config();
const express = require('express')
const app = express()
var morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose');
const Person = require('./module/person');

app.use(express.json());

morgan.token('body', (req) => JSON.stringify(req.body));

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.use(cors())

app.use(express.static('dist'))


app.get('/', (request,response)=>{
    response.send('<h1>PhoneBook-backend</h1>')
})

app.get('/info', (request, response) => {
  Person.countDocuments({}).then(count => {
    const now = new Date();
    const dateTimeString = now.toString();
    response.send(`<p>Phonebook has info for ${count} people</p><br/><p>${dateTimeString}</p>`);
  });
});

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons);
  });
});

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch(error => next(error));
});

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch(error => next(error));
});

app.post('/api/persons', (request, response, next) => {
  const { name, number } = request.body;

  if (!name || !number) {
    return response.status(400).json({ error: 'name or number missing' });
  }

  const person = new Person({
    name,
    number
  });

  person.save()
    .then(savedPerson => {
      response.json(savedPerson);
    })
    .catch(error => next(error));
});

app.put('/api/persons/:id', (request, response, next) => {
  const { id } = request.params;
  const { name, number } = request.body;

  if (!name || !number) {
    return response.status(400).json({ error: 'name or number missing' });
  }

  Person.findByIdAndUpdate(
    id,
    { name, number },
    { new: true, runValidators: true }
  )
    .then(updatedPerson => {
      if (updatedPerson) {
        response.json(updatedPerson);
      } else {
        response.status(404).end();
      }
    })
    .catch(error => next(error));
});

// Handler for unknown endpoints
app.use((request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
});


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})