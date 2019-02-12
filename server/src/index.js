'use strict';

require('babel-register')({
    presets: [ 'env' ]
})

var server = require('./server');

const PORT =  3001;
server.listen(PORT, function() {
    console.log(`api running on ${PORT}`);
});