'use strict';

require('babel-register')({
    presets: [ 'env' ]
})


var {http} = require('./server');

const HOST =  '0.0.0.0';
const PORT =  3001;
http.listen(PORT, HOST,function() {
    console.log(`api running on ${PORT}`);
});