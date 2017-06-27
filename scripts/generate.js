'use strict';

process.env.NODE_ENV = 'production';

const chokidar = require('chokidar');
const ora = require('ora');
const chalk = require('chalk');
const mkdirp = require('mkdirp');

const fs = require('fs');
const path = require('path');
const slugify = require('slugify');

// import configuration files
const init = require('./init');
const bc = require('../blog_config.json');
const utils = require('./utils.js');

// init nunjucks and blog and env variables
const {blog} = init.init();

// initilize some constants
const ROOT_DIR = process.env.ROOT_DIR;
const THEME_DIR = path.join(ROOT_DIR,'themes',bc.meta.blog_theme);
const spinner = ora({text:'Fetching posts',spinner:'line'});
let posts = [];
let labels = [];


// template generation
function generateTemplates(){
        let flatPosts = posts.reduce((posts_prev,posts_next)=>posts_prev.concat(posts_next));
        let pagination = {next:null,prev:null};

        // index pages and pagination
        posts.forEach((post_arr,cur_page)=>{
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
                } else {
                  utils.generateIndexTemplate(post_arr,labels,pagination,'dist',cur_page+1+'.html');
                }
        });

        // post pages
        flatPosts.forEach(post=>{
                utils.generatePostTemplate(post,labels,'dist');
        });

        // other pages
        utils.generatePageTemplate('dist');

        // category pages
        utils.generateCategoryTemplates2(labels,'dist')
}

function startGenerate(){
      mkdirp.sync(path.join(ROOT_DIR,'dist','category'));
      mkdirp.sync(path.join(ROOT_DIR,'dist','posts'));
      generateTemplates();
}

function getAllPosts(){
  let posts = [];
  return new Promise((resolve,reject)=>{
    (function callFetchBlogPosts(){
      blog.fetchBlogPosts()
          .then(_posts=>{
                if(blog.settings.posts.last_reached){
                        resolve(posts);
                }
                else{
                  callFetchBlogPosts();
                }
                posts.push(_posts);
          })
          .catch(function(err){
                console.log(chalk.bold.red('Could not fetch github data for some reason\nUsing offline data.'));
                reject();
          });
    })()
  });
}

function getAllLabels(){
  return new Promise((resolve,reject)=>{
    blog.fetchAllLabels()
        .then(_labels=>{
                resolve(_labels);
        })
        .catch(err=>{
                console.log(chalk.bold.red('Could not fetch github label data due to network issue'));
                reject();
        });
  });
}


function fetchAndStoreData(){
  Promise.all([getAllPosts(), getAllLabels()])
         .then(vals=>{
            spinner.stop();
            posts = vals[0];
            labels = vals[1];
            startGenerate();
         })
         .catch(err=>{
            spinner.stop();
            console.log(chalk.bold.red('Network issue, try again'));
         })
}

spinner.start();
fetchAndStoreData();
