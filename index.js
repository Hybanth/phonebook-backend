const express = require('express')
const app = express()
var morgan = require('morgan')
const cors = require('cors')

app.use(express.json());

morgan.token('body', (req) => JSON.stringify(req.body));

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.use(cors())

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request,response)=>{
    response.send('<h1>PhoneBook-backend</h1>')
})

app.get('/info',(request,response)=>{
  const now = new Date();
  const dateTimeString = now.toString();
  response.send(`<p>Phonebook has info for ${persons.length} people</p><br/><p>${dateTimeString}</p>`)
})

app.get('/api/persons',(request, response)=>{
    response.json(persons)
})

app.get('/api/persons/:id',(request, response)=>{
  const id = Number(request.params.id);
  const person = persons.find(person => person.id === id)
  if(person){
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id',(request, response)=>{
  const id = request.params.id
  persons = persons.filter(person => person.id != id)

  response.status(204).end()
})

app.post('/api/persons',(request, response)=>{
  const { name, number } = request.body

  if (!name || !number) {
    return response.status(400).json({ error: 'name or number missing' })
  }

  const nameExists = persons.some(person => person.name === name)
  if (nameExists) {
    return response.status(400).json({ error: 'name must be unique' })
  }
  
  const newId = Math.floor(Math.random() * 1000000)
  const newPerson = {
    id: newId,
    name: name,
    number: number
  }

  persons = persons.concat(newPerson)
  response.json(newPerson)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})