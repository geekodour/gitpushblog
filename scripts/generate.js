'use strict';

process.env.NODE_ENV = 'production';

const ora = require('ora');
const chalk = require('chalk');
const path = require('path');
//const gitblog = require('github-blog-api');
const mkdirp = require('mkdirp');

// import configuration files
const init = require('./init');
const bc = require('../blog_config.json');
const utils = require('./utils.js');

// init nunjucks and blog and env variables
const {blog} = init.init();


// initilize some constants, `process.env.ROOT_DIR` is set in `utils.js`
const ROOT_DIR = process.env.ROOT_DIR;
const spinner = ora({text:'Fetching posts',spinner:'line'});
let posts = [];
let labels = [];
// const pagination = {next:0,prev:0};


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
      let flatPosts = posts.reduce((posts_prev,posts_next)=>posts_prev.concat(posts_next));
      let pagination = {next:null,prev:null};

      mkdirp.sync(path.join(ROOT_DIR,'dist','category'));
      mkdirp.sync(path.join(ROOT_DIR,'dist','posts'));
      // category templates
      Promise.all(utils.generateCategoryTemplates(labels,'dist'))
             .then(()=>{

               // index templates
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

               // post templates
               flatPosts.forEach(post=>{
                       utils.generatePostTemplate(post,labels,'dist');
               });

               // page templates
               utils.generatePageTemplate('dist');

             });
}


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
