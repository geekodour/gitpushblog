'use strict';

process.env.NODE_ENV = 'production';

var chalk = require('chalk');
var slug = require('slug');
var fs = require('fs');
var marked = require('marked');
var mkdirp = require('mkdirp');
var path = require('path');
var gitblog = require('github-blog-api');
var bc = require('../blog_config.json');
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
 * template generation
 * * * * * * * * * * * */
function generatePostTemplate(post){
        var fileName = slug(post.title)+".html";
        var renderContent = nunjucks.render('post_page.html',{post: post});
        fs.writeFile(ROOT_DIR+"/dist/posts/"+fileName, renderContent, function(err) {
            if(err) { return console.log(err); }
            console.log(chalk.bold.green('==>')+chalk.white(' %s was created'), post.title);
        });
}

function generateIndexTemplate(posts,fileName,labels){
        var renderContent = nunjucks.render('index.html',{posts:posts,labels:labels});
        fs.writeFile(ROOT_DIR+"/dist/"+fileName+".html", renderContent, function(err) {
            if(err) { return console.log(err); }
            console.log(chalk.green('%s was created'), fileName);
        });
}

function createdir(dirpath){
        return new Promise((resolve,reject)=>{
                mkdirp(dirpath, function (err) {
                    if (err) reject(err);
                    resolve();
                });
        })
}





function fetchAndGenerateTemplates(_labels){
      blog.fetchBlogPosts()
          .then(function(posts){
                pageno += 1;

                if(!blog.settings.posts.next_page_url){
                  generateIndexTemplate(posts,'index',_labels);
                }
                else{
                  generateIndexTemplate(posts,pageno,_labels);
                }


                // post_page.html
                posts.forEach(function(post){
                        generatePostTemplate(post);
                });

                if(!blog.settings.posts.last_reached){
                        fetchAndGenerateTemplates(_labels);
                }
          })
          .catch(function(err){
                console.log(err);
          });
}


// initiate the blog
var blog = gitblog({username:bc.username,repo:bc.repo,author:bc.author});
blog.setPost({per_page:bc.posts_per_page});

blog.fetchAllLabels()
        .then(_labels=>{
                // make `posts` directory; otherwise fs.writeFile throws error
                createdir(ROOT_DIR+'/dist/posts')
                        .then(e=>{
                                fetchAndGenerateTemplates(_labels);
                        })
        });
