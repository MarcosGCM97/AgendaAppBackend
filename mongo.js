const mongoose = require('mongoose')

if(process.argv.length<3){
    console.log('give password as argument');
    process.exit(1)
}

const password = process.argv[2]

const url = 
    `mongodb+srv://marcoscongregado:${password}@cluster0.4h79rpg.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personShema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personShema)

const person = new Person({
    name: 'Robert',
    number: '6586-324-5123'
})

/*person.save().then(result => {
    console.log('person saved!', result)
    mongoose.connection.close()
})*/
Person.find({}).then(result=>{
    result.forEach(person =>{
        console.log(person)
    })
    mongoose.connection.close()
})