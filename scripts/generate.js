'use strict';

process.env.NODE_ENV = 'production';

//var chalk = require('chalk');
var fs = require('fs');
var marked = require('marked');
var mkdirp = require('mkdirp');
var path = require('path');
var gitblog = require('github-blog-api');
var blog_config = require('../blog_config.json');
var _nunjucks = require('nunjucks');

var ROOT_DIR = path.resolve('.');

/* * * * * * * * * * * * *
 * nunjucks configuration
 * * * * * * * * * * * * * */
var nunjucks = _nunjucks.configure(ROOT_DIR+'/views', { autoescape: true, trimBlocks: true, lstripBlocks: true});

nunjucks.addFilter('slug', function(str, count) {
    return str.toLowerCase().split(' ').join('-')+".html";
});


/* * * * * * * * * * * *
 * template generation
 * * * * * * * * * * * */
function generatePostTemplate(post){
        var fileName = post.title.toLowerCase().split(' ').join('-')+".html";
        post.html = marked(post.body);
        var renderContent = nunjucks.render('post_page.html',{post: post});
        fs.writeFile(ROOT_DIR+"/build/posts/"+fileName, renderContent, function(err) {
            if(err) { return console.log(err); }
            console.log(post.title+" was created");
        });
}

function generateIndexTemplate(posts){
        var renderContent = nunjucks.render('index.html',{posts:posts});
        fs.writeFile(ROOT_DIR+"/build/index.html", renderContent, function(err) {
            if(err) { return console.log(err); }
            console.log("index was created");
        });
}

function createdir(dirpath){
        mkdirp(dirpath, function (err) {
            if (err) console.error(err);
        });
}



// initiate the blog
// chjj/marked/
//var blog = gitblog({author:'geekodour',repo:'gitpushblog'});
var blog = gitblog({author:'casualjavascript',repo:'blog'});
// creation of the blog variable better be sync and put the author fetch to another function
//eg. blog.fetchAuthorInfo().then();

blog.fetchBlogPosts().then(function(posts){
        // index.html
        generateIndexTemplate(posts);

        // make `posts` directory; otherwise fs.writeFile throws error
        createdir(ROOT_DIR+'/build/posts');

        // post_page.html
        posts.forEach(function(post){
                generatePostTemplate(post);
        });

        // other pages
});

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
