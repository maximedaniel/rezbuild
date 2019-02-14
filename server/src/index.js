'use strict';

require('babel-register')({
    presets: [ 'env' ]
})
var mongoose = require("mongoose");
var {http} = require('./server');


const PORT =  3001;
http.listen(PORT, function() {
    console.log(`api running on ${PORT}`);
});