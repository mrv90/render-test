const express = require('express');
const app = express();
const cors = require('cors');
const corsOptions ={
    origin:'*', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
 }

const requestLogger = (request, response, next) => {
    console.log(`\nMethod: ${request.method} Path: ${request.path} Body: ${JSON.stringify(request.body)}`);
    next();
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(requestLogger);

let data = [
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
];

app.get('/api/persons', (request, response) => {
    response.json(data);
});

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    const target = data.find(d => d.id == id);

    if (target != undefined)
        response.end(JSON.stringify(target));
    else
        response.status(404).end();
});

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    if (data.map(d => d.id).includes(id)) 
    {
        notes = data.filter(note => note.id !== id)
        response.status(204).end();
    }
    else
        response.status(404).end();
})

app.post('/api/persons/', (request, response) => {
    console.log('request:', request);    
    const {name, number} = request.body;

    if (name == undefined || number == undefined)
        return response.status(400).json({ 
            error: 'invalid name or number'
        })
    else if (data.map(d => d.name).includes(name))
        return response.status(400).json({ 
            error: 'name must be unique'
        })
    else {
        const newPerson = {
            id: Math.max(...data.map(d => d.id)) + 1,
            name: name,
            number: number
        };
    
        data = data.concat(newPerson);
        response.json(newPerson);
    }
})

let numberOfRequestsReceived = 0;
app.get('/info', (request, response) => {
    response.end(`The phonebook has info for ${++numberOfRequestsReceived} people \n${new Date}`);
});

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})