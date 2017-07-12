'use strict';

process.env.NODE_ENV = 'development';

const chokidar = require('chokidar');
const ora = require('ora');
const server = require('pushstate-server');
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
mkdirp.sync(path.join(ROOT_DIR,'drafts'));
const DRAFT_DIR = path.join(ROOT_DIR,'drafts');
const PORT = 3000;

// global variables
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
                utils.generateIndexTemplate(post_arr,labels,pagination,'dev',fileName);
        });

        // post pages
        flatPosts.forEach((post,currentPostIndex) => {
                utils.generatePostTemplate(post,labels,flatPosts,currentPostIndex,'dev');
        });

        // other pages
        utils.generatePageTemplate('dev');

        // category pages
        utils.generateCategoryTemplates(labels,flatPosts,'dev')

}

function startDevMode(){

      mkdirp.sync(path.join(ROOT_DIR,'dev','category'));
      mkdirp.sync(path.join(ROOT_DIR,'dev','posts'));
      generateTemplates();

      const themeWatcher = chokidar.watch([THEME_DIR], {
        ignored: /[\/\\]\./
      });
      const draftWatcher = chokidar.watch([DRAFT_DIR], {
        ignored: /[\/\\]\./
      });

      const draftWatcherCallback = () => {
         utils.getOfflineFileContents()
               .then(offlinePostObjects=>{
                 posts[0] = posts[0].slice(offlinePostObjects.length);
                 posts[0].unshift(...offlinePostObjects);
                 generateTemplates();
         });
      }


      themeWatcher
        .on('change', (path, stats) => { generateTemplates(); })
        .on('add', (path, stats) => { generateTemplates(); })
        .on('unlink', (path, stats) => { generateTemplates(); });

      draftWatcher
        .on('change', (path, stats) => { draftWatcherCallback(); })
        .on('add', (path, stats) => { draftWatcherCallback(); })
        .on('unlink', (path, stats) => { draftWatcherCallback(); });

      console.log(chalk.bold.green(`Templates generated. \nAvailable on:\n http://localhost:${PORT}`));
}

function getAllPosts(){
  let posts = [];
  // this promise returns after there are recursive calls to the IIFE callFetchBlogPosts
  // I think this is a bad idea, if you have any other idea, please feel free to suggest
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
            // adding the offlinePostObjects, i.e vals[2] to the top array element of `posts`
            posts[0].unshift(...vals[2]);
            startDevMode();
         })
         .catch(err=>{
            spinner.stop();
            utils.getOfflineFileContents()
                 .then(offlinePostObjects=>{
                   posts.push(offlinePostObjects);
                   startDevMode();
                 })
         })
}

// start the dev
spinner.start();
fetchAndStoreData();

// start the dev server silently
server.start({
  port: PORT,
  directory: path.join(ROOT_DIR,'dev')
});
