const ghpages = require('gh-pages');
const init = require('./init.js');
const {bc} = init.init();

const callback = (err) => {
    if (err) throw err;
    console.log('done!');
}

if(bc.userpage){

  ghpages.publish('dist', {
    branch: 'master',
    repo: `https://github.com/${bc.username}/${bc.username}.github.io`
  }, callback);

} else {

  ghpages.publish('dist', callback);

}


