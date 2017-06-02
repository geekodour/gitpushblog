'use strict';

process.env.NODE_ENV = 'production';

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
   //return str.toLowerCase().split(' ').join('-')+".html";
   return slug(str)+".html";
});


/* * * * * * * * * * * *
 * template generation
 * * * * * * * * * * * */
function generatePostTemplate(post){
        //var fileName = post.title.toLowerCase().split(' ').join('-')+".html";
        var fileName = slug(post.title)+".html";
        post.html = marked(post.body);
        var renderContent = nunjucks.render('post_page.html',{post: post});
        fs.writeFile(ROOT_DIR+"/build/posts/"+fileName, renderContent, function(err) {
            if(err) { return console.log(err); }
            console.log(chalk.bold.green('==>')+chalk.white(' %s was created'), post.title);
        });
}

function generateIndexTemplate(posts,fileName,labels){
        var renderContent = nunjucks.render('index.html',{posts:posts,labels:labels});
        fs.writeFile(ROOT_DIR+"/build/"+fileName+".html", renderContent, function(err) {
            if(err) { return console.log(err); }
            console.log(chalk.green('%s was created'), fileName);
        });
}

function createdir(dirpath){
        mkdirp(dirpath, function (err) {
            if (err) console.error(err);
        });
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

                // make `posts` directory; otherwise fs.writeFile throws error
                createdir(ROOT_DIR+'/build/posts');

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
var blog = gitblog({username:'casualjavascript',repo:'blog',author:'mateogianolio'});
blog.setPost({per_page:2});

blog.fetchAllLabels()
        .then(_labels=>{
                fetchAndGenerateTemplates(_labels);
        });
