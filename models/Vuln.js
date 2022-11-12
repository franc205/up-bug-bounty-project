const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const vulnSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    description: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    risk: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    status: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    id_company: {
        type: String,
        required: true
    },
    id_hacker: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Vuln', vulnSchema);
