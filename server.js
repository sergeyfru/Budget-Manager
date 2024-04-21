const express = require('express')
const route = require('./routes/routes.js')
const session = require('express-session')

const app = express()

app.use(session({
  secret: 'how__iT_Works', // Замените на свой секрет
  resave: false,
  saveUninitialized: false
}))



app.use(express.urlencoded({extended:true}))
app.use(express.json())


app.use(express.static('./public'))

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
});

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
});

app.get('/budget', (req, res) => {
    res.sendFile(__dirname + '/public/main.html');
});



const port = 5000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use('/',route)