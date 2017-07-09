process.env.NODE_ENV = 'production';

const init = require('./init.js');
const {bc} = init.init();

const exec = require('child_process').exec;

const callback = (err) => { if (err){throw err;console.log('check repo url')} console.log('done!'); }

if(bc.meta.userpage){

  let subtreecommand = `git subtree split --prefix dist`;
  let commitmessage = `blog updates`;

  exec(`git add --force dist`);
  exec(`git commit -m '${commitmessage}'`);
  //exec(`git push https://github.com/${bc.username}/${bc.username}.github.io.git \`${subtreecommand}\`:master --force`, puts);
  exec(`git push https://github.com/geekodour/geekodour.github.io.git \`${subtreecommand}\`:master --force`, callback);

} else {

  let subtreecommand = `git subtree push --prefix dist`;
  let commitmessage = `blog updates`;

  exec(`git add --force dist`);
  exec(`git commit -m '${commitmessage}'`);
  exec(`${subtreecommand} origin gh-pages`, callback);
}
