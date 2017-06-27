// offline editor, upload
'use strict';
process.env.NODE_ENV = 'production';

const path = require('path');
const ora = require('ora');
const chalk = require('chalk');
const rimraf = require('rimraf');
const fs = require('fs');
const gitblog = require('github-blog-api');
const bc = require('../blog_config.json');
const utils = require('./utils.js');

const ROOT_DIR = process.env.ROOT_DIR;
const spinner = ora({text:'Uploading posts',spinner:'line'});

//require('dotenv').config({path:ROOT_DIR+"/.env"});
require('dotenv').config({path:path.join(ROOT_DIR,'.env')});

const blog = gitblog({username:bc.username,repo:bc.repo,author:bc.author});
blog.setPost({per_page:bc.posts_per_page});

module.exports = {
  uploadFiles: function(offlinePosts){
    const uploadPromises = offlinePosts.map(function(post){
      return blog.createPost(post,process.env.GITHUB_AUTH_TOKEN);
    });
    Promise.all(uploadPromises)
           .then(()=>{
             spinner.stop();
             console.log(chalk.bold.green(`Posts uploaded! Delete files inside drafts?[y/n]`));
             rimraf.sync(ROOT_DIR+'/drafts/*');
           })
           .catch(err=>{
             spinner.stop();
             console.log(chalk.bold.red(`Could not upload, Network Error`));
             console.log(err);
           });
  }
}

