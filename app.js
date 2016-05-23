var mongoose = require('mongoose'),
    data = require('./data');

// mongodb connect
mongoose.connect('mongodb://60132263:dutls123@ds061984.mlab.com:61984/surveyna');
mongoose.connection.on('error', console.log);
