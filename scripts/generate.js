'use strict';
// the generate scripts skips the drafts and skips watch mode

process.env.NODE_ENV = 'production';

const chokidar = require('chokidar');
const ora = require('ora');
const chalk = require('chalk');
const mkdirp = require('mkdirp');

const fs = require('fs');
const path = require('path');

// import configuration files
const init = require('./init');
const utils = require('./utils.js');

// init nunjucks and blog and env variables
const {blog,bc} = init.init();
const spinner = ora({text:'Fetching posts',spinner:'line'});

// initilize some constants
const ROOT_DIR = process.env.ROOT_DIR;
const THEME_DIR = path.join(ROOT_DIR,'themes',bc.meta.blog_theme);

// global variables, will get rid of them soon
let posts = []; // array of post_arr(s), post_arr is array of postObjects
let labels = []; // array of labelObject(s)

// template generation
function generateTemplates(){
        let flatPosts = posts.reduce((posts_prev,posts_next)=>posts_prev.concat(posts_next));
        let pagination = {next:null,prev:null};
        let fileName = '';

        // index pages and pagination
        posts.forEach( (post_arr,cur_page) => {
                // generate pagination
                pagination = utils.generatePagination(pagination,posts,cur_page);
                // generate fileName
                fileName = cur_page === 0 ? `index.html` : `${cur_page+1}.html`;
                // generate index template
                utils.generateIndexTemplate(post_arr,labels,pagination,fileName);
        });

        // post pages
        flatPosts.forEach((post,currentPostIndex) => {
                utils.generatePostTemplate(post,labels,flatPosts,currentPostIndex);
        });

        // other pages
        utils.generatePageTemplate();

        // category pages
        utils.generateCategoryTemplates(labels,flatPosts)

        // feed template
        utils.generateFeedTemplate(flatPosts)
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

// start the generation
spinner.start();
fetchAndStoreData();
