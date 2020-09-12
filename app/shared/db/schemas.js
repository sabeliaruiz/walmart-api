const mongoose = require('./db'),
      Schema = mongoose.Schema;

const schemas = {

    productSchema: new Schema({
        id: {type: Number},
        brand:{type: String},
        description: {type: String},
        image: {type: String},
        price: {type: String}
    })

};

module.exports = schemas;