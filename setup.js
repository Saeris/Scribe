'use strict';
var fs = require('fs');
fs.createReadStream('.env-setup')
  .pipe(fs.createWriteStream('.env'));
