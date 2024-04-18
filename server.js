const express = require('express')
const route = require('./routes/routes.js')

const app = express()


app.use('/',route)




const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});