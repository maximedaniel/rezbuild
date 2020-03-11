/**
 * @module Launcher
 */

'use strict';
require('babel-register')({presets: ['env']});
var {www} = require('./www');

const PORT = 3001;
const HOST = '0.0.0.0';

// Run the API on address {HOST}:{PORT}
www.listen(PORT, HOST,  () => console.log(`api running on ${HOST}:${PORT}`));