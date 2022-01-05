
const Sauce = require('../models/Sauce');
const fs = require('fs');

//Création de sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,    
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enreggistré !'}))
        .catch(error => res.status(400).json(console.log(error)));        
};
//Récupération de toutes les sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json( { error}));
};
//Récupération d'une seule sauce
exports.getOneSauce = (req, res, next) =>{
    Sauce.findOne({_id: req.params.id})
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};
//Modification d'une sauce
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
    {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
        .then(() =>  res.status(200).json({ message: 'Sauce mofifié !'}))
        .catch(error => res.status(400).json({  error }));
    });
  })
    .catch(error => res.status(500).json({ error }));
};
//Suppression d'une sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimé !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
        
};
// J'aime ou j'aime (Like, Dislike)
exports.likeSauce = (req, res) => {
    /* Like de la sauce */
    if (req.body.like === 1) {
      Sauce.findOneAndUpdate(
        { _id: req.params.id },
        { $inc: { likes: 1 }, $push: { usersLiked: req.body.userId } }
      )
        .then(() => res.status(200).json({ message: "Like ajouté !" }))
        .catch((error) => res.status(400).json({ error }));
  
      /* Dislike de la sauce */
    } else if (req.body.like === -1) {
      Sauce.findOneAndUpdate(
        { _id: req.params.id },
        { $inc: { dislikes: 1 }, $push: { usersDisliked: req.body.userId } }
      )
        .then(() => res.status(200).json({ message: "Dislike ajouté !" }))
        .catch((error) => res.status(400).json({ error }));
  
      /* Annuler un like ou dislike */
    } else {
      Sauce.findOne({ _id: req.params.id }).then((resultat) => {
        if (resultat.usersLiked.includes(req.body.userId)) {
          Sauce.findOneAndUpdate(
            { _id: req.params.id },
            { $inc: { likes: -1 }, $pull: { usersLiked: req.body.userId } }
          )
            .then(() => res.status(200).json({ message: "like retiré !" }))
            .catch((error) => res.status(400).json({ error }));
        } else if (resultat.usersDisliked.includes(req.body.userId)) {
          Sauce.findOneAndUpdate(
            { _id: req.params.id },
            { $inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId } }
          )
            .then(() => res.status(200).json({ message: "dislike retiré !" }))
            .catch((error) => res.status(400).json({ error }));
        }
      });
    }
  };
