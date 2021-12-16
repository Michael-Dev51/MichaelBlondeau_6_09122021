const express = require('express');
//Impot de mongoose
const mongoose = require('mongoose');
const path = require('path');
//Importation des routes
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');
const app = express();
//CORS (ajout des headers à l'objet response pour qu'il puissent communiquer entre deux origines)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

mongoose.connect('mongodb+srv://DevMi51:21OcMbswmO0125@cluster0.ncuj1.mongodb.net/piiquante?retryWrites=true&w=majority',
    { useNewUrlParser: true,
      useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use('/api/sauce', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;