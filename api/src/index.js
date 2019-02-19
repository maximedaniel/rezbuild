'use strict';

require('babel-register')({
    presets: [ 'env' ]
})


var {http} = require('./server');

const PORT =  3001;
const HOST =  '0.0.0.0';

http.listen(PORT, HOST, function() {
    console.log(`api running on ${HOST}:${PORT}`);
});