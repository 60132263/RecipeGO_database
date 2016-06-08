var mongoose = require('mongoose'),
    data = require('./data');

// mongodb connect
mongoose.connect('mongodb://recipego:mju12345@ds011902.mlab.com:11902/recipego');
mongoose.connection.on('error', console.log);
