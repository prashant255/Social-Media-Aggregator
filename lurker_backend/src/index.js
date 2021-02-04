const express = require('express')
const morgan = require('morgan') //For logging API calls
const bodyParser = require('body-parser')
const session = require('express-session');

const app = express()

//Handling CORS so that frontend can use API's on some other port
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Aceess-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use(session({secret: 'whatever', resave: true, saveUninitialized: true}))


const Twitter = require('../routers/twitter')
const Reddit = require('../routers/reddit')

//port is provided in the environment variable.
const port = process.env.PORT 

app.use(express.json())
app.use('/api/twitter', Twitter)
app.use('/api/reddit', Reddit)

app.get('/test', (req, res) => {
    res.send("Test successful") 
})

app.get('*', (req, res) => {
    res.send('404 page not found!').status(404)    
})

app.listen(port, () => {
    console.log('Server is up and running on port: ' + port)
})