const express = require('express');
//Impot de mongoose
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
//Importation des routes
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');
const app = express();

//Variable d'environnement chargées depuis le fichier .env
require('dotenv').config();
//CORS (ajout des headers à l'objet response pour qu'il puissent communiquer entre deux origines)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

mongoose.connect(process.env.DB_CONNEXION,
    { useNewUrlParser: true,
      useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);


module.exports = app;