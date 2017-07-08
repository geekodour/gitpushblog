process.env.NODE_ENV = 'production'; // required, if not specified will run in watch mode

const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const chalk = require('chalk');
const init = require('./init');
const log = console.log.bind(console,'> ');
init.init();

const ROOT_DIR = process.env.ROOT_DIR;
mkdirp.sync(path.join(ROOT_DIR,'drafts')); // create `drafts/` if does not exist
const DRAFT_DIR = path.join(ROOT_DIR,'drafts');
const fileName = process.argv[2];

const markdownTemplate = `---
title: just a title
labels:
  - label sample
---

write in markdown...
`;

if(process.argv.length !== 3){
  log(chalk.bold.red(`can't have filenamewithspaces or a filewithoutaname ;)`));
}else{
  fs.writeFile(path.join(DRAFT_DIR,fileName), markdownTemplate, 'utf8', (err,res) => {
    if (err) throw err;
    log(chalk.bold.green(`${fileName} created in ${chalk.yellow(path.join(DRAFT_DIR,fileName))} !`));
  });
}

