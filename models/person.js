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
        minlength: [3, 'Type more than {VALUE} characters'],
        required: true
    },
    number:{
        type: String,
        minlength:[8],
        required: true,
        validate: {
            validator: function(value){
                return /^\d{2,3}-\d+$/.test(value)
            }
        }
    }
})

personShema.pre('save', function(next){
    console.log('its a error')
    next()
})

personShema.set('toJSON',{
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personShema)