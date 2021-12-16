const mongoose = require('mongoose');
//Import du plugin validator
const uniqueValidator = require('mongoose-unique-validator');
// Modèle user
const userSchema = mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: { type: String, required: true}
});
//Application du plugin validator sur userSchema
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);