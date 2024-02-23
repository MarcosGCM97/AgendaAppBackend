//Mongo Data Base
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.DB_URL

console.log('connecting to', url);

mongoose.connect(url)
    .then(result => {
        console.log('connected to  MongoDB')
    })
    .catch((error)=>{
        console.log('error connecting to MongoDB', error.message)
    })

const personShema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    number:{
        type: String,
        required: true
    }
})

personShema.set('toJSON',{
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personShema)