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

        // index pages
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

        console.log(chalk.bold.green(`Templates generated. \nAvailable on:\n http://localhost:${PORT}`));
}


// fetch github data

function fetchAndStoreData(){
  blog.fetchBlogPosts()
      .then(_posts=>{

            posts.push(_posts);

            if(!blog.settings.posts.last_reached){
                    fetchAndStoreData();
            }
            else {
                    spinner.stop();
                    posts[0].unshift(...listOfFiles)
                    startDevMode();
            }
      })
      .catch(function(err){
            spinner.stop();
            console.log(chalk.bold.red('Could not fetch github data for some reason\nUsing offline data.'));
            posts.push(listOfFiles)
            startDevMode();
      });
}

function startDevMode(){

      mkdirp.sync(path.join(ROOT_DIR,'dev','category'));
      mkdirp.sync(path.join(ROOT_DIR,'dev','posts'));
      // Promise.all the creation of category pages
      // then create index and other pages
      // There is mixed use of sync and async functions
      // need to fix that
      Promise.all(utils.generateCategoryTemplates(labels,'dev'))
             .then(()=>{
               // index and post pages
               generateTemplates();
               // other pages
               utils.generatePageTemplate('dev');
             });

      // watch for changes in the theme directory and regenerate on change
      chokidar.watch(THEME_DIR, {ignored: /(^|[\/\\])\../}).on('all', (event, path) => {
        if(event === "change"){
                generateTemplates();
        }
      });
}

// start the dev thing
spinner.start();
blog.fetchAllLabels()
        .then(_labels=>{
                labels = _labels;
                let fileContents = utils.getOfflineFileContents();
                Promise.all(fileContents).then((offlineFileContents)=>{
                  listOfFiles = offlineFileContents;
                  fetchAndStoreData();
                });
        })
        .catch(err=>{
                let fileContents = utils.getOfflineFileContents();
                Promise.all(fileContents).then((offlineFileContents)=>{
                  listOfFiles = offlineFileContents;
                  fetchAndStoreData();
                });
                console.log(chalk.bold.red('Could not fetch github data due to network issue'));
        });


// start the dev server silently
server.start({
  port: PORT,
  directory: path.join(ROOT_DIR,'dev')
});
