const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
require('mongoose-type-email');
mongoose.SchemaTypes.Email.defaults.message = 'Email address is invalid'
const mongooseFieldEncryption = require("mongoose-field-encryption").fieldEncryption;

const userSchema = mongoose.Schema({
  email: { type: String , required: true, unique: true },// unique: true mongoose.SchemaTypes.Email
  password: { type: String, required: true },
});

userSchema.plugin(uniqueValidator);
userSchema.plugin(mongooseFieldEncryption, { fields: ["email"], secret: `${process.env.SECRET_KEYS}`, saltGenerator: function (secret) {
  return "1234567890123456";
},
});
module.exports = mongoose.model("user", userSchema);