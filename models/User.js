const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    email: {
        type: String,
        required: true,
        min: 6,
        max: 1024
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: false
    }
})

module.exports = mongoose.model('User', userSchema);
