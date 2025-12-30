const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.q5wwjwu.mongodb.net/?appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url, { family: 4 })

const phoneBookSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Phonebook = mongoose.model('Phonebook', phoneBookSchema)

const name = process.argv[3]
const number = process.argv[4]

if (name && number) {
  const person = new Phonebook({
    name,
    number,
  })

  person.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
} else {
  Phonebook.find({}).then((res) => {
    console.log('phonebook:')
    res.forEach((item) => console.log(`${item.name} ${item.number}`))
    mongoose.connection.close()
  })
}
