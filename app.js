const express = require('express');
const app = express();
const userRoutes = require('./routes/userRouter');
const mysql = require('mysql2');
const { Sequelize } = require('sequelize')
require('dotenv').config();
// const path = require('path');

// //Database connexion-------------------
// db = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password:process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
// });

// db.connect(function(err) {
//     if(err) {
//         console.error("Connexion DB échouée : "+err);
//     } else {
//         console.log("Connexion DB réussie!")
//     }
// })
const sequelize = new Sequelize(process.env.DB_NAME,process.env.DB_USER,process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql'
});

try {
    sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
  module.exports = sequelize;

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