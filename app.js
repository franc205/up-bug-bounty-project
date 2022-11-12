const express = require("express");
const app = express();
const mongoose = require('mongoose');
require('dotenv').config()

/*NOTA MUY IMPORTANTE: Checkear que la IP este permitida en Mongo*/
const uri = `mongodb+srv://${process.env.USUARIO}:${process.env.PASSWORD}@test.omt7sva.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> console.log('Conectado a mongodb exitosamente!')) 
  .catch(e => console.log('error de conexión', e))

app.use(express.json());

app.use('/v1/users', require('./routes/users'));
app.use('/v1/companies', require('./routes/companies'));


app.listen(3000, () => {
   console.log("Node JS Running on Port 3000...");
});