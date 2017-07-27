process.env.NODE_ENV = 'production';

if(process.argv.length !== 3){
  throw new RangeError(`You must provide theme name and theme name can't contain spaces`);
}

const chalk = require('chalk');
const ncp = require('ncp').ncp;
const mkdirp = require('mkdirp');
const path = require('path');
const {bc} = require('./init.js').init();

const log = console.log.bind(console,'> ');

const themeName = process.argv[2];
const ROOT_DIR = process.env.ROOT_DIR;
const THEME_DIR = path.join(ROOT_DIR,'themes',themeName);
const THEME_DIR_PARENT = path.join(ROOT_DIR,'themes');
const THEME_SOURCE = path.join(ROOT_DIR,'scripts','themefiles');

mkdirp.sync(path.join(THEME_DIR_PARENT,themeName));

ncp(THEME_SOURCE, THEME_DIR, function (err) {
 if (err) {
   return console.error(err);
 }
 console.log('done!');
});
