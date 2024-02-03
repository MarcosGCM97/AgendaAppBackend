const express  = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors')

app.use(express.json())
app.use(cors())

morgan.token('person', function(req, res){
    return JSON.stringify(req.person)
})

app.use(morgan(':method :url :status :res[content-lenght] :response-time :person'))

let persons= [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Ada Lovelance",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    },
    {
        "name": "Marcos gabriel Congregado",
        "number": "3543650722",
        "id": 5
    }
]

const info =()=>{
    let date = new Date()
    let people = persons.length
    
    return `<p>Phonebook has info for ${people} people</p>
            <p>${date}</p>`
}

app.get('/',(request, response)=>{
    response.send('<h1>Hello World!</h1>')
})
//Get array
app.get('/api/persons', (request, response)=>{
    response.send(persons)
})
//Get individual
app.get('/api/persons/:id', (request, response)=>{
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    
    if(person){
        response.json(person)
    } else {
        response.status(404).end()
    }
})
//Delete individual
app.delete('/api/persons/:id', (request, response)=>{
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})
//Post solicitud
app.post('/api/persons', (request, response)=>{
    const maxId = Math.floor(Math.random() * 100)

    const body = request.body
    
    if(!body.name){
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: maxId
    }

    persons = persons.concat(person)

    request.person = {
        name: request.body.name,
        number: request.body.number
    }

    response.json(person)
})

app.get('/info', (request,response)=>{
    response.send(info())
})


const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)