process.env.NODE_ENV = 'production';

const ghpages = require('gh-pages');
const init = require('./init.js');
const {bc} = init.init();

// gh-pages npm package does not seem to have a --force option, which is needed sometimes
// so have to call the git command directly for userpages
//const sys = require('sys');
const sys = require('util');
const exec = require('child_process').exec;

// functions
const puts = (error, stdout, stderr) => {
        if (error) {
          console.log('exec error: ' + error);
        }
        //sys.puts(stdout);
        console.log(stdout);
        console.log("DONE");
}
const callback = (err) => { if (err){throw err;console.log('check repo url')} console.log('done!'); }
//console.log(JSON.stringify(bc));
if(bc.meta.userpage){

  exec('git push https://github.com/geekodour/geekodour.github.io.git `git subtree split --prefix dist`:master --force', puts);
  /*
  ghpages.publish('dist', {
    branch: 'master',
    repo: `https://github.com/${bc.username}/${bc.username}.github.io.git`
    },
    callback
  );*/

} else {
  ghpages.publish('dist', callback );

}


