const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const validator = require("email-validator");
const passwordValidator = require('./passwordvalidator');


exports.signup = (req, res, next) => {
  const isValidateEmail = validator.validate(req.body.email);
  const isValidatePassword = passwordValidator.validate(req.body.password);
  if (!isValidatePassword) {
      res.status(400).json({ error : "mot de passe non valide" });
  }
  else if(!isValidateEmail) {
    res.status(400).json({ error : "email non valide" });
  } else {
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const user = new User({
          email: req.body.email,
          password: hash
        });
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
    }
};



  exports.login = (req, res, next) => {
    const encrypt = new User({ email: req.body.email })
    encrypt.encryptFieldsSync();
    User.findOne({ email: encrypt.email })
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        bcrypt.compare(req.body.email, user.email)
        bcrypt.compare(req.body.password, user.password)
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            res.status(200).json({
              userId: user._id,
              token: jwt.sign(
                { userId: user._id },
                'RANDOM_TOKEN_SECRET',
                { expiresIn: '24h' }
              )
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };