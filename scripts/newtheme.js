process.env.NODE_ENV = 'production';

const init = require('./init.js');
const chalk = require('chalk');
const {bc} = init.init();
const log = console.log.bind(console,'> ');

const exec = require('child_process').exec;

