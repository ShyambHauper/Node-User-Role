const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    roleName: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    accessModules: {
        type: [String],
        default: [],
        validate: [arrayLimit, '{PATH} exceeds the limit of 50']
    },
    active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

function arrayLimit(val) {
    return val.length <= 50;
}

module.exports = mongoose.model('Role', roleSchema);
