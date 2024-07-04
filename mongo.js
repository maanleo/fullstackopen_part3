const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}
const password = process.argv[2]

const url =
  `mongodb+srv://maan468:${password}@cluster0.srfswra.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const phoneBookSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Phonebook = mongoose.model('PhoneBook', phoneBookSchema)

if(process.argv.length === 3){
   const allrecords = Phonebook.find({}).then((result)=>{
    mongoose.connection.close();
    console.log('phonebook:')
    result.forEach((record)=>{
        console.log(`${record.name} ${record.number}`)
    })
   });
}
else{
    const record = new Phonebook({
        name: process.argv[3],
        number: process.argv[4],
      })
      
      record.save().then(result => {
        console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook!`)
        mongoose.connection.close()
      })
}