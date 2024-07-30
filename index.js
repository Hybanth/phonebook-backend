require('dotenv').config();
const express = require('express')
const app = express()
var morgan = require('morgan')
const cors = require('cors')
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

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch(error => {
      console.error('Error fetching person:', error);
      response.status(500).json({ error: 'failed to fetch person' });
    });
});

app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch(error => {
      console.error('Error deleting person:', error);
      response.status(500).json({ error: 'failed to delete person' });
    });
});

app.post('/api/persons', (request, response) => {
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
    .catch(error => {
      console.error('Error saving person:', error);
      response.status(500).json({ error: 'failed to save person' });
    });
});


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})