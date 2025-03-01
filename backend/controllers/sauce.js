const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce); 
        //delete sauceObject._id;
        const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        });
        sauce.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
        .catch(error => res.status(400).json({ error: error }));
    };

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
    }

exports.getAllSauces = (req, res, next) => {
Sauce.find()
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(400).json({ error }));
}

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
      {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifié !'}))
        .catch(error => res.status(400).json({ error }));
    }
  
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
}

  exports.likeSauce = (req, res, next) => {    
    const like = req.body.like; 

    Sauce.findOne({ _id: req.params.id }) 

    .then(sauce => {
        //Si le users like la sauce il se passera:
        switch(like) {
            case 1:                                                 
            Sauce.updateOne({ _id: req.params.id }, {           
              $inc: { likes: 1 },                                 
              $push: { usersLiked: req.body.userId }             
            })
              .then(() => { res.status(201).json({ message: "vote enregistré." }); }) 
              .catch((error) => { res.status(400).json({ error }); }); 
            break;
          
            case -1:                                                  
            Sauce.updateOne({ _id: req.params.id }, {               
              $inc: { dislikes: 1 },                                
              $push: { usersDisliked: req.body.userId }             
            })
              .then(() => { res.status(201).json({ message: "vote enregistré." }); }) 
              .catch((error) => { res.status(400).json({ error }); }); 
            break;

            case 0:
             
              Sauce.findOne({ _id: req.params.id })
              .then(sauce => {
              if (sauce.usersLiked.find( user => user === req.body.userId)) {  // on cherche si l'utilisateur est déjà dans le tableau usersLiked
                Sauce.updateOne( 
                    {_id: req.params.id},
                    {$pull: { usersLiked: req.body.userId }, $inc: { likes: -1 }},                    
                )
                .then(() => { res.status(201).json({ message: "vote retiré" }); })
                .catch((error) => { res.status(400).json({error}); });
              }
             
              if (sauce.usersDisliked.find(user => user === req.body.userId)) { 
                Sauce.updateOne( 
                    {_id: req.params.id},
                    {$pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 }},                    
                )

                .then(() => { res.status(201).json({ message: "vote retiré" }); })
                .catch((error) => { res.status(400).json({error}); });
                }
              })
              .catch((error) => { res.status(404).json({error}); });
              break;
        }
    })
    .catch((error) => res.status(404).json({error}))
};
