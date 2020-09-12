const mongoose = require('mongoose');

mongoose.connect('mongodb://172.17.0.1:27017/walmart');

module.exports = mongoose;