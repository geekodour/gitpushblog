'use strict';

/*
 *
 *  STYLE IS INCONSISTET
 *  SOULD I MAKE THE SCRIPT ES6 OR ES5???
 *
 * */

process.env.NODE_ENV = 'development';

var chokidar = require('chokidar');
var rimraf = require('rimraf');
var chalk = require('chalk');
var slug = require('slug');
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
var nunjucks = _nunjucks.configure(ROOT_DIR+'/views', { autoescape: true, trimBlocks: true, lstripBlocks: true, watch: true});

// slug filter
nunjucks.addFilter('slug', function(str, count) {
   return slug(str)+".html";
});



/* * * * * * * * * * * *
 * Template generation
 * * * * * * * * * * * */

function createdir(dirpath){
        return new Promise((resolve,reject)=>{
                mkdirp(dirpath, function (err) {
                    if (err) reject(err);
                    resolve();
                });
        })
}

function generatePostTemplate(post){
        //var fileName = post.title.toLowerCase().split(' ').join('-')+".html";
        var fileName = slug(post.title)+".html";
        post.html = marked(post.body);
        var renderContent = nunjucks.render('post_page.html',{post: post});
        fs.writeFile(ROOT_DIR+"/tempbuild/posts/"+fileName, renderContent, function(err) {
            if(err) { return console.log(err); }
            console.log(chalk.bold.green('==>')+chalk.white(' %s was created'), post.title);
        });
}

function generateIndexTemplate(posts,fileName,labels){
        var renderContent = nunjucks.render('index.html',{posts:posts,labels:labels});
        fs.writeFile(ROOT_DIR+"/tempbuild/"+fileName+".html", renderContent, function(err) {
            if(err) { return console.log(err); }
            console.log(chalk.green('%s was created'), fileName);
        });
}

function generateTemplates(){
        let flatPosts = posts.reduce((posts_prev,posts_next)=>posts_prev.concat(posts_next));

        posts.forEach(function(post_arr,i){
                if(i==0){
                  generateIndexTemplate(post_arr,'index',labels);
                }
                else{
                  generateIndexTemplate(post_arr,i+1,labels);
                }
        });

        // post_page.html
        flatPosts.forEach(function(post){
                generatePostTemplate(post);
        });
}

/* * * * * * * * * * * *
 * fetch github data
 * * * * * * * * * * * */

function fetchAndStoreData(_labels){
  blog.fetchBlogPosts()
      .then(function(_posts){

            posts.push(_posts);

            if(!blog.settings.posts.last_reached){

                    console.log(chalk.bold.yellow('Fetching...'));
                    fetchAndStoreData(_labels);
            }
            else {
                    console.log(chalk.bold.green('Fetching finished!'));
                    labels = _labels;
                    startDevMode();
            }
      })
      .catch(function(err){
            console.log(err);
      });
}

/* * * * * * * * * * * *
 * Dev mode
 * * * * * * * * * * * */

function startDevMode(){

                // make `posts` directory; otherwise fs.writeFile throws error
                createdir(ROOT_DIR+'/tempbuild/posts')
                        .then(e=>{
                                generateTemplates();
                        });

                // watch for changes and regenerate on change
                chokidar.watch(ROOT_DIR+'/views', {ignored: /(^|[\/\\])\../}).on('all', (event, path) => {
                  console.log(event, path);
                  if(event === "change"){
                          generateTemplates();
                  }
                });
}

// start the dev thing
var posts = [];
var labels = [];
var blog = gitblog({username:'casualjavascript',repo:'blog',author:'mateogianolio'});
blog.setPost({per_page:blog_config.posts_per_page});

blog.fetchAllLabels()
        .then(_labels=>{
                fetchAndStoreData(_labels);
        });
