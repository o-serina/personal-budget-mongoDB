const mongoose = require("mongoose")

const validate = require("mongoose-validator")

var colorValidator = [
    validate({
        validator: 'matches',
        arguments: ['^#([A-Fa-f0-9]{6})$'],
        message: 'Color should be a valid hex color code, exactly 6 characters long.'
    })
];

const budgetSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    budget: {
        type: Number,
        trim: true,
        required: true,
    },
    backgroundColor: {
        type: String,
        trim: true,
        required: true,
        minlength: 6,
        validate: colorValidator,
    }
}, {collection: 'myBudget'})

module.exports = mongoose.model('myBudget', budgetSchema)