'use strict';

require('babel-register')({
    presets: [ 'env' ]
})

var server = require('./server');

var port = process.env.API_PORT || 3001;
server.listen(port, function() {
    console.log(`api running on ${port}`);
});