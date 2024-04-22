const express = require('express')
const route = require('./routes/routes.js')
const session = require('express-session')
const cors = require('cors')

const app = express()

app.use(session({
  secret: 'how__iT_Works', // Замените на свой секрет
  resave: false,
  saveUninitialized: false
}))

app.use(cors());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5500');
  next();
});

// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', 'http://localhost:5000');
//   next();
// });

app.use(express.urlencoded({extended:true}))
app.use(express.json())


app.use(express.static('./public'))

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
});

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
});

app.get('/main', (req, res) => {
    res.sendFile(__dirname + '/public/main2.html');
});



const port = 5000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use('/',route)