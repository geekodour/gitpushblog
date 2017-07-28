process.env.NODE_ENV = 'production';

const init = require('./init.js');
const chalk = require('chalk');
const {bc} = init.init();
const log = console.log.bind(console,'> ');

//const exec = require('child_process').exec;
const exec = require('child_process').execSync;

const callback = (err) => {
        if (err){
          throw err;console.log('check repo url')
        }
        log(chalk.bold.green('pushed changes'));
}

if(bc.meta.userpage){

  log(chalk.bold.green(`Pushing changes to master branch of ${bc.username}/${bc.username}.github.io`));

  let subtreecommand = `git subtree split --prefix dist`;
  // same commit message for every commit
  let commitmessage = `blog updates`;

  try {
    exec(`git add -A`);
    exec(`git commit -m '${commitmessage}'`);
  }
  finally {
    exec(`git push https://github.com/${bc.username}/${bc.username}.github.io.git \`${subtreecommand}\`:master --force`, callback);
  }


} else {

  // else clause: this is a repopage blog
  log(chalk.bold.green(`Pushing changes to gh-pages branch of ${bc.username}/${bc.repo}`));

  //let subtreecommand = `git subtree push --prefix dist`;
  let subtreecommand = `git subtree split --prefix dist`;
  let commitmessage = `blog updates`;

  try {
    exec(`git add -A`);
    exec(`git commit -m '${commitmessage}'`);
  }
  finally {
    // exec(`${subtreecommand} origin gh-pages`, callback);
    exec(`git push origin \`${subtreecommand}\`:gh-pages --force`, callback);
  }

}
