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
const init = require('./init.js');

const {blog} = init.init();

// initilize some constants
require('dotenv').config({path:path.join(ROOT_DIR,'.env')});
const ROOT_DIR = process.env.ROOT_DIR;
const uploadSpinner = ora({text:'Uploading posts',spinner:'line'});
const GITHUB_AUTH_TOKEN = process.env.GITHUB_AUTH_TOKEN;
const offlinePostObjects = []

const getUploadPromises = () => {
  utils.getOfflineFileContents()
       .then(offlinePostObjects=>{
         return offlinePostObjects.map(postObject=>{
           return blog.createPost(postObject,GITHUB_AUTH_TOKEN);
         });
       });
}

const uploadPosts = () => {
  uploadSpinner.start();
  getUploadPromises()
     .then(e=>{console.log(e)})

  /*
  Promise.all([getUploadPromises()])
         .then((res)=>{
           console.log(res)
           uploadSpinner.stop();
           console.log(chalk.bold.green(`Posts uploaded! files from drafts folder will be deleted.`));
           console.log(chalk.bold.yellow(`Please run, npm run generate or npm run dev to refect the uploaded posts in the static site`));
           rimraf.sync(ROOT_DIR+'/drafts/*');
         })
         .catch(err=>{
           uploadSpinner.stop();
           console.log(chalk.bold.red(`Could not upload, Network Error`));
           console.log(err);
         });*/
}

module.exports = {
  uploadPosts
}
