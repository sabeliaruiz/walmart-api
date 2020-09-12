const mongoose = require('./db'),
productSchema = require('./schemas').productSchema;

const models = {
    Product: mongoose.model('product', productSchema)
};

module.exports = models;