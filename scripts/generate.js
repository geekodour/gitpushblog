'use strict';

process.env.NODE_ENV = 'production';

//var chalk = require('chalk');
var fs = require('fs');
var mkdirp = require('mkdirp');
var path = require('path');
var gitblog = require('github-blog-api');
var blog_config = require('../blog_config.json');
var _nunjucks = require('nunjucks');

var ROOT_DIR = path.resolve('.');


var nunjucks = _nunjucks.configure(ROOT_DIR+'/views', { autoescape: true, trimBlocks: true, lstripBlocks: true});

nunjucks.addFilter('slug', function(str, count) {
    return str.toLowerCase().split(' ').join('-')+".html";
});

// initiate the blog
var blog = gitblog({author:'geekodour',repo:'gitpushblog'});

// template generation
function generatePostTemplate(post){
        var fileName = post.title.toLowerCase().split(' ').join('-')+".html";
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

blog.fetchBlogPosts().then(function(posts){
        // index.html
        generateIndexTemplate(posts);
        // make `posts` directory
        mkdirp(ROOT_DIR+'/build/posts', function (err) {
            if (err) console.error(err);
        });
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
