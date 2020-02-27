const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
    email: { type: String, unique: true, lowercase: true, required: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
