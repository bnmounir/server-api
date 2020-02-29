const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
    email: { type: String, unique: true, lowercase: true, required: true },
    password: { type: String, required: true }
});
userSchema.methods.comparePassword = function(passwordEntered, callback) {
    bcrypt
        .compare(passwordEntered, this.password)
        .then(isMatch => callback(null, isMatch))
        .catch(err => callback(err));
};

const User = mongoose.model('User', userSchema);
module.exports = User;
