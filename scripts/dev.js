'use strict';

process.env.NODE_ENV = 'development';

const chokidar = require('chokidar');
const ora = require('ora');
const server = require('pushstate-server');
const chalk = require('chalk');
const mkdirp = require('mkdirp');
const fs = require('fs');
const path = require('path');
const gitblog = require('github-blog-api');
const slugify = require('slugify');

const bc = require('../blog_config.json');
const utils = require('./utils.js');
const _nunjucks = require('./nunjucks_config.js');

const ROOT_DIR = process.env.ROOT_DIR;
const THEME_DIR = path.join(ROOT_DIR,'themes',bc.meta.blog_theme);
const spinner = ora({text:'Fetching posts',spinner:'line'});

// nunjucks configuration
const nunjucks = _nunjucks.init();

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

        console.log("REVISION "+ rev++ +" GENERATED.");
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
      // create category directory
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
let posts = [];
let labels = [];
let listOfFiles = [];
let rev = 0;
const blog = gitblog({username:bc.username,repo:bc.repo,author:bc.author});
blog.setPost({per_page:bc.posts_per_page});

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
  port: 3000,
  directory: path.join(ROOT_DIR,'dev')
});
