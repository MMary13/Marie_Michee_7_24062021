const express = require('express');
const app = express();
const userRoutes = require('./routes/userRouter');
// const path = require('path');

// //Database connexion-------------------

//Middleware CORS, to add correct headers--------------
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
  });  

//Cookies security--------------------------
app.use((req,res,next) => {
  res.cookie('superCookie', '1', { expires: new Date(Date.now() + 3*3600000), httpOnly: true });
  next();
});


app.use(express.json());
// app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', userRoutes);
module.exports = app;