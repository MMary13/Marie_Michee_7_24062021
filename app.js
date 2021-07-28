const express = require('express');
const app = express();
const userRoutes = require('./routes/userRouter');
const postRoutes = require('./routes/postRouter');
const commentRoutes = require('./routes/commentRouter');
const { Sequelize } = require('sequelize')
require('dotenv').config();
const path = require('path');

// //Database connexion-------------------
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
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', userRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comment', commentRoutes);
module.exports = app;