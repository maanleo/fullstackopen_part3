const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express()
app.use(express.json());
app.use(cors());
app.use(express.static('dist'))

let persons =[
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];

morgan.token('input', function (request, response) { return JSON.stringify(request.body) });
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :input')
)

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
    response.send(`<p style="margin:0">Phonebook has info for ${persons.length} people</p><br/><p style="margin:0">${(new Date()).toString()}</p>`)
  })

app.get('/api/persons', (request, response) => {
  response.json(persons);
});

app.delete('/api/persons/:id',(request,response)=>{
    const deleteId = request.params.id;
    persons =persons.filter(person=>person.id!==deleteId);
    response.sendStatus(204);
})

app.post('/api/persons/',(request,response)=>{
    const newId = Math.floor(100000*Math.random());
    const newName = request.body.name;
    const newNumber = request.body.number;

    const existing = persons.filter((person)=>person.name === newName);

    if(newName && newNumber){
        if(existing && existing.length>0){
            response.status(409).json({error:'name must be unique'});
        }
        else{
            persons.push({id:newId.toString(),name:request.body.name,number:newNumber})
            response.status(201).json(`Created data with id ${newId}`);
        }
    }
    else{
        response.status(400).json({error:'name and number must be provided to add new data'});
    }
})

app.get('/api/persons/:id', (request, response) => {
    const person = persons.find((person=>person.id===request.params.id));
    if(person){
        response.json(person);
    }
    else{
        response.sendStatus(404)
    }
    
  })

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})