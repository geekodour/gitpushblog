const ghpages = require('gh-pages');

ghpages.publish('dist', function(err) {
    if (err) throw err;
    log(chalk.bold.green(`blog was pushed to gh-pages branch! yay!`)); // this line does not work
});
