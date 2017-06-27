'use strict';

process.env.NODE_ENV = 'development';

const chokidar = require('chokidar');
const ora = require('ora');
const server = require('pushstate-server');
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
const PORT = 3000;
let posts = [];
let labels = [];
let listOfFiles = [];
const spinner = ora({text:'Fetching posts',spinner:'line'});


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
                  utils.generateIndexTemplate(post_arr,labels,pagination,'dev','index.html');
                } else {
                  utils.generateIndexTemplate(post_arr,labels,pagination,'dev',cur_page+1+'.html');
                }
        });

        // post pages
        flatPosts.forEach(post=>{
                utils.generatePostTemplate(post,labels,'dev');
        });

        // other pages
        utils.generatePageTemplate('dev');

        // category pages
        utils.generateCategoryTemplates2(labels,'dev')

        console.log(chalk.bold.green(`Templates generated. \nAvailable on:\n http://localhost:${PORT}`));
}

function startDevMode(){

      mkdirp.sync(path.join(ROOT_DIR,'dev','category'));
      mkdirp.sync(path.join(ROOT_DIR,'dev','posts'));
      generateTemplates();

      // watch for changes in the theme directory and regenerate on change
      chokidar.watch(THEME_DIR, {ignored: /(^|[\/\\])\../}).on('all', (event, path) => {
        if(event === "change"){
                generateTemplates();
        }
      });
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
                resolve(posts);
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
                resolve(labels);
        });
  });
}


function fetchAndStoreData(){
  Promise.all([getAllPosts(), getAllLabels(),utils.getOfflineFileContents()])
         .then(vals=>{
            spinner.stop();
            posts = vals[0];
            labels = vals[1];
            listOfFiles = vals[2];
            posts[0].unshift(...listOfFiles)
            startDevMode();
         })
         .catch(err=>{
            spinner.stop();
            utils.getOfflineFileContents()
                 .then(files=>{
                   posts.push(files)
                   startDevMode();
                 })
         })
}

spinner.start();
fetchAndStoreData();

// start the dev server silently
server.start({
  port: PORT,
  directory: path.join(ROOT_DIR,'dev')
});
