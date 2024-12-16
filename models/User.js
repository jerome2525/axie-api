const mongoose = require('mongoose');

// Define the User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true }
});

// Use existing model or create a new one
const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;