const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const companySchema = mongoose.Schema({
    company: {
        type: String,
        required: true,
        min: 1,
        max: 255
    },
    description: {
        type: String,
        required: true,
        min: 1,
        max: 255
    },
})

module.exports = mongoose.model('Company', companySchema);

