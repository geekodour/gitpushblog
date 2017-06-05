'use strict';

/*
 *  STYLE IS INCONSISTET
 *  MAKE THE SCRIPT ES6 OR ES5???
 * */

process.env.NODE_ENV = 'production';

var ora = require('ora');
var chalk = require('chalk');
//var slug = require('slug');
//var fs = require('fs');
//var marked = require('marked');
//var mkdirp = require('mkdirp');
var path = require('path');
var gitblog = require('github-blog-api');
var bc = require('../blog_config.json');
var _nunjucks = require('./nunjucks_config.js');
var utils = require('./utils.js');

var ROOT_DIR = path.resolve('.');
var spinner = ora({text:'Fetching posts',spinner:'line'});
var pageno = 1; // needed for generating pagination


// nunjucks configuration
var nunjucks = _nunjucks.init();

// template generation
function fetchAndGenerateTemplates(_labels){
      spinner.start();
      blog.fetchBlogPosts()
          .then(function(posts){
                pageno += 1;

                if(!blog.settings.posts.next_page_url){
                  utils.generateIndexTemplate(posts,_labels,'dist','index.html');
                }
                else{
                  utils.generateIndexTemplate(posts,_labels,'dist',pageno+'.html');
                }

                posts.forEach(function(post){
                        utils.generatePostTemplate(post,_labels,'dist');
                });

                if(!blog.settings.posts.last_reached){
                        fetchAndGenerateTemplates(_labels);
                }
                else{
                  spinner.stop();
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
    // create category directory
    utils.createdir(ROOT_DIR+'/dist/category')
      .then(e=>{
        // create category pages
        Promise.all(utils.generateCategoryTemplates(_labels,'dist'))
                .then(()=>{
                        // create posts directory
                        utils.createdir(ROOT_DIR+'/dist/posts')
                                .then(e=>{
                                        // create index and post pages
                                        fetchAndGenerateTemplates(_labels);
                                        // create other pages
                                        utils.generatePageTemplate('dist');
                                })
                });
      })
  });
