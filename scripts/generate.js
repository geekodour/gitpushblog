'use strict';

/*
 *  STYLE IS INCONSISTET
 *  MAKE THE SCRIPT ES6 OR ES5???
 * */

process.env.NODE_ENV = 'production';

var ora = require('ora');
var chalk = require('chalk');
var path = require('path');
var gitblog = require('github-blog-api');
var mkdirp = require('mkdirp');

var bc = require('../blog_config.json');
var _nunjucks = require('./nunjucks_config.js');
var utils = require('./utils.js');

var ROOT_DIR = path.resolve('.');
var spinner = ora({text:'Fetching posts',spinner:'line'});
var pagination = {next:0,prev:0};


// nunjucks configuration
var nunjucks = _nunjucks.init();

// template generation
function fetchAndStoreData(){
  blog.fetchBlogPosts()
      .then(function(_posts){

            posts.push(_posts);

            if(!blog.settings.posts.last_reached){
                    fetchAndStoreData();
            } else {
                    spinner.stop();
                    generateTemplates();
            }
      })
      .catch(function(err){
            spinner.stop();
            console.log(chalk.bold.red('Could not connect to the internet'));
      });
}

function generateTemplates(){
      var flatPosts = posts.reduce((posts_prev,posts_next)=>posts_prev.concat(posts_next));
      var pagination = {next:null,prev:null};

      mkdirp.sync(ROOT_DIR+'/dist/category');
      mkdirp.sync(ROOT_DIR+'/dist/posts');
      // category templates
      Promise.all(utils.generateCategoryTemplates(labels,'dist'))
             .then(()=>{
               // page templates
               utils.generatePageTemplate('dist');
               // index templates
               posts.forEach(function(post_arr,cur_page){
                       pagination = Object.assign(pagination,
                         {
                           next:(posts.length === cur_page+1)?0:cur_page+2,
                           prev:cur_page>0
                               ?cur_page==1?'index':cur_page
                               :0
                         }
                       );
                       if(cur_page==0){
                         utils.generateIndexTemplate(post_arr,labels,pagination,'dist','index.html');
                       }
                       else{
                         utils.generateIndexTemplate(post_arr,labels,pagination,'dist',cur_page+1+'.html');
                       }
               });

               // post templates
               flatPosts.forEach(function(post){
                       utils.generatePostTemplate(post,labels,'dist');
               });

             });
}

// initiate the blog
var blog = gitblog({username:bc.username,repo:bc.repo,author:bc.author});
blog.setPost({per_page:bc.posts_per_page});
var posts = [];
var labels = [];


spinner.start();
blog.fetchAllLabels()
        .then(_labels=>{
          labels = _labels;
          fetchAndStoreData();
        })
        .catch(err=>{
          spinner.stop();
          console.log(chalk.bold.red('Network Error'));
        });
