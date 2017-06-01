'use strict';

process.env.NODE_ENV = 'development';

/*
* the dev build will be done in a temporay folder
* ctrl+c should delete the temp folder,
* also the folder should be cleaned before starting this script
*
* github data will be fetched once on script run and stored in variables
* chokidar will see for changes in nunjucks templates
* and webpack will see for changes in stactic files
*
* on each change chokidar detects it should update all html files of that template
* with relevant data from stored github data
*
* */

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


var pageno = 1; // needed for generating pagination

/* * * * * * * * * * * * *
 * nunjucks configuration
 * * * * * * * * * * * * * */
var nunjucks = _nunjucks.configure(ROOT_DIR+'/views', { autoescape: true, trimBlocks: true, lstripBlocks: true});

// slug filter
nunjucks.addFilter('slug', function(str, count) {
   return slug(str)+".html";
});

/* * * * * * * * * * * *
 * fetch github data
 * * * * * * * * * * * */
var pageno = 1;
var posts = [];
var labels = [];
function fetchAndStoreData(){
  return Promise.all([blog.fetchBlogPosts(),blog.fetchAllLabels()])
          .then(function(postsData){

                posts = posts.concat(postsData[0]);
                labels = postsData[1];

                if(!blog.settings.posts.last_reached){
                        fetchAndStoreData();
                }
          })
          .catch(function(err){
                console.log(err);
          });
}


function generatePostTemplate(post){
        var fileName = slug(post.title)+".html";
        post.html = marked(post.body);
        var renderContent = nunjucks.render('post_page.html',{post: post});
        fs.writeFile(ROOT_DIR+"/tempbuild/posts/"+fileName, renderContent, function(err) {
            if(err) { return console.log(err); }
            console.log(chalk.bold.green('==>')+chalk.white(' %s was created'), post.title);
        });
}

function generateIndexTemplate(postsData,fileName){
        var renderContent = nunjucks.render('index.html',{posts:postsData[0],labels:postsData[1]});
        fs.writeFile(ROOT_DIR+"/tempbuild/"+fileName+".html", renderContent, function(err) {
            if(err) { return console.log(err); }
            console.log(chalk.green('%s was created'), fileName);
        });
}

function generateTemplates(){
        // clean `tempbuild`
        rimraf(ROOT_DIR+"/tempbuild/*");
}

var blog = gitblog({username:'casualjavascript',repo:'blog',author:'mateogianolio'});
blog.setPost({per_page:10});

fetchAndStoreData()
        .then(function(){
                chokidar.watch(ROOT_DIR+'/views', {ignored: /(^|[\/\\])\../}).on('all', (event, path) => {
                  console.log(event, path);
                  // because generating templates is a non timeconsuming task
                  // generate all templates on change detection
                  // otherwise will have to setup file detections
                  generateTemplates();
                });
        })
        .catch(function(e){
                console.log(e);
        });


/* * * * * * * * * * * *
 * template generation
 * * * * * * * * * * * */


// initiate the blog
