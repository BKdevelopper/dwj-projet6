const express = require('express')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const sauceRoute = require('./route/sauce')
const userRoutes = require('./route/user');
const path = require('path')
const dotenv = require('dotenv').config();
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const app = express();

const reqLimiter = rateLimit ( { 
  windowMs : 15 * 60 * 1000 ,  // 15 minutes 
  max : 15 // nb essaie 15
});

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}`,
{   
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true 
})
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));



app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });



app.use("/api/auth/login", reqLimiter);
app.use(helmet());
app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, 'images')))

app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoute); 
module.exports = app;
