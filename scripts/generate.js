'use strict';

process.env.NODE_ENV = 'production';

//require('dotenv').config({silent: true});
//var chalk = require('chalk');
var fs = require('fs');
var path = require('path');
var blog = require('github-blog-api');
var blog_config = require('../blog_config.json');
var nunjucks = require('nunjucks');

var ROOT_DIR = path.resolve('.');

nunjucks.configure(ROOT_DIR+'/views', { autoescape: true, trimBlocks: true, lstripBlocks: true});
console.log(path.dirname(require.main.filename));

var myblog = blog({author:'geekodour',repo:'gitpushblog'});
function generatePostTemplate(post){
        var renderContent = nunjucks.render('post_page.html',{post:post});
        var fileName = post.title.toLowerCase().split(' ').join('-');
        fs.writeFile(ROOT_DIR+"/build/"+fileName+".html", renderContent, function(err) {
            if(err) { return console.log(err); }
            console.log(post.title+" was created");
        });
}

myblog.fetchBlogPosts().then(function(posts){
        posts.forEach(function(post){
                generatePostTemplate(post);
        });
});

console.log(blog_config);

/*
 * - fetch all blogposts from github
 * - for each blogpost, generate 'post-title.html' from 'post-page' template with blog data
 *   and put them in build folder
 * - from blog.json, get pages and page template paths
 * - generate those pages and put them in build folder
 */


// Warn and crash if required files are missing [WILL THIS WORK]
//if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
//  process.exit(1);
//}
