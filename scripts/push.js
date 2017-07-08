const ghpages = require('gh-pages');
const init = require('./init.js');
const {bc} = init.init();

ghpages.publish('dist', (err) => {
    if (err) throw err;
    console.log('done!')
});
