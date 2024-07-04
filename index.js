const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const errorHandler = require('./ErrorHandler');
const PhoneBook = require('./models/phonebook');
const app = express()
app.use(express.json());
app.use(cors());
app.use(express.static('dist'))


morgan.token('input', function (request, response) { return JSON.stringify(request.body) });
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :input')
)

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
    let count = 0;
    PhoneBook.find({}).then(records => {
      count = records.length;
    })
    response.send(`<p style="margin:0">Phonebook has info for ${count} people</p><br/><p style="margin:0">${(new Date()).toString()}</p>`)
})

app.get('/api/persons', (request, response,next) => {
    PhoneBook.find({}).then(records => {
      response.json(records)
    })
    .catch((error)=>
      next(error)
    )
});

app.delete('/api/persons/:id',(request,response,next)=>{
    const deleteId = request.params.id;
    PhoneBook.findByIdAndDelete(deleteId).then(record => {
      response.sendStatus(204);
    }).catch((error)=>
      next(error)
    )  
})

app.post('/api/persons/',(request,response,next)=>{
    const newName = request.body.name;
    const newNumber = request.body.number;

    let existing = false;

    PhoneBook.find({name:newName}).then(record => {
      existing = record;
    })

    if(newName && newNumber){
        if(existing && existing.length>0){
            response.status(409).json({error:'name must be unique'});
        }
        else{
            const record = new PhoneBook({
              name: newName,
              number: newNumber,
            })
            
            record.save().then(result => {
              console.log(`added ${newName} number ${newNumber} to phonebook!`)
              response.status(201).json(`Created data with id ${result._id}`);
            }).catch((error)=>{
              next(error);
            })

        }
    }
    else{
        next({message:'name and number must be provided to add new data',status:400})
    }
})

app.patch('/api/persons/:id',(req,res,next)=>{
  PhoneBook.findByIdAndUpdate(req.params.id,{number:req.body.number},{ runValidators: true}).then((update)=>{
    res.send('Updated');
  }).catch((error)=>{
    next(error);
  })
})

app.get('/api/persons/:id', (request, response,next) => {
    PhoneBook.findById(request.params.id).then(record => {
      response.json(record)
    })
    .catch((error)=>{
      next(error)
    })   
  })

app.use(errorHandler);

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})