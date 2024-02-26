require('dotenv').config()
const express  = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors')
const path = require('path');
const Person = require('./models/person')

app.use(express.static(path.join(__dirname, 'build')))
app.use(express.json())
app.use(cors())

morgan.token('person', function(req, res){
    return JSON.stringify(req.person)
})

app.use(morgan(':method :url :status :res[content-lenght] :response-time :person'))

//handle error
const errorHandler = (error, req, res, next) => {
    console.error(error.message, 'hola')

    if(error.name === 'CastError'){
        return res.status(400).send({error: 'malformatted id'})
    } else if(error.name === 'ValidationError'){
        return res.status(400).json({ error: error.message })
    }

    next(error)
}

app.use(errorHandler)


let persons= [
    /*{
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
    }*/
]

const info =()=>{
    let date = new Date()
    let people = persons.length
    
    return `<p>Phonebook has info for ${people} people</p>
            <p>${date}</p>`
}

app.get('/',(request, response)=>{
    response.sendFile(path.join(__dirname, 'build', 'index.html'))

})
//Get array
app.get('/api/persons', (request, response)=>{
    //response.send(persons)
    Person.find({}).then(person=>{
        response.json(person)
    })
    console.log(request)
})
//Get individual
app.get('/api/persons/:id', (request, response, next)=>{
    /*const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    
    if(person){
        response.json(person)
    } else {
        response.status(404).end()
    }*/
    Person.findById(request.params.id)
        .then( person => {
            if(person){
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

//Delete individual
app.delete('/api/persons/:id', (request, response, next)=>{
    /*const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()*/
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
            console.log(result)
        })
        .catch(error => next(error))
})

//Post solicitud
app.post('/api/persons', (request, response, next)=>{
    const maxId = Math.floor(Math.random() * 100)
    const body = request.body
    
    /*if(body.name === undefined){
        return response.status(400).json({
            error: 'content missing'
        })
    }*/

    const person = new Person({
        name: body.name,
        number: body.number,
        id: maxId
    })

    person.save()
        .then(savedPerson =>{
        response.json(savedPerson)
        })
        .catch(error => next(error))
    /*persons = persons.concat(person)

    request.person = {
        name: request.body.name,
        number: request.body.number
    }

    response.json(person)*/
})

app.put('/api/persons/:id', (request, response, next)=>{
    const { name, number} = request.body
    
    /*const person = {
        name: body.name,
        number: body.number,
        id: body.id
    }*/
    
    Person.findByIdAndUpdate(
        request.params.id, 
        { name, number },
        { new: true, runValidators: true, context: 'query' }
    )
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

app.get('/info', (request,response)=>{
    response.send(info())
}) 


const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server running on port ${PORT}`)