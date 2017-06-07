'use strict';
var _nunjucks = require('nunjucks');
var path = require('path');

var ROOT_DIR = path.resolve('.');

if(process.env.NODE_ENV === "production"){
  var nunjucks_opts = { autoescape: true, trimBlocks: true, lstripBlocks: true, watch: false };
}
else{
  var nunjucks_opts = { autoescape: true, trimBlocks: true, lstripBlocks: true, watch: true };
}

var nunjucks = _nunjucks.configure(ROOT_DIR+'/views', nunjucks_opts);

// date filter
nunjucks.addFilter('date', function(str, count) {
   // BUGGY, DOES NOT GIVE CORRECT RESULT
   var dateObj = new Date(str);
   return dateObj.getDate()+"/"+ dateObj.getMonth()+"/"+ dateObj.getFullYear();
});

// stringify filter
nunjucks.addFilter('stringify', function(obj, count) {
   return JSON.stringify(obj);
});

module.exports = {
        init: function(){ return nunjucks; }
};
