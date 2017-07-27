'use strict';
process.env.NODE_ENV = 'production';

const path = require('path');
const ora = require('ora');
const inquirer = require('inquirer');
const chalk = require('chalk');
const rimraf = require('rimraf');
const fs = require('fs');
const gitblog = require('github-blog-api');
const utils = require('./utils.js');
const init = require('./init.js');

const {blog,bc} = init.init();

// initilize some constants
const ROOT_DIR = process.env.ROOT_DIR;
require('dotenv').config({path:path.join(ROOT_DIR,'.env')});
const GITHUB_AUTH_TOKEN = process.env.GITHUB_AUTH_TOKEN;

const uploadSpinner = ora({text:'Uploading posts',spinner:'line'});
const draftPrompt = inquirer.createPromptModule();
const log = console.log.bind(console,'> ');
let uploadedFileNames = [];

// non-exported functions
const getUploadPromises = () => {
  return new Promise((resolve,reject)=>{
    utils.getOfflineFileContents()
      .then( offlinePostObjects => {

          let offlinePostNames = offlinePostObjects.map(post=>({name:post.title}))

          if(offlinePostNames.length<1){
            reject(new TypeError("No posts in drafts directory"));
          } else {
            draftPrompt([
              {
                type: 'checkbox',
                message: 'Select posts to upload',
                name: 'posts',
                choices: offlinePostNames,
                validate: answer => {
                  if (answer.length < 1) {
                    return 'You did not select any post, no post will be uploaded. hit ctrl+c';
                    reject();
                  }
                  return true;
                }
              }
            ]).then(answers => {
              // upload only selected posts
              offlinePostObjects = offlinePostObjects.filter(post => answers.posts.indexOf(post.title)>-1 );
              // update uploadedFileNames with fileNames of posts to be uploaded
              uploadedFileNames = offlinePostObjects.map(post=>post.fileName);
              // return the promise
              uploadSpinner.start();
              resolve(offlinePostObjects.map(postObject=>blog.createPost(postObject,GITHUB_AUTH_TOKEN)));
            });
        }
      });
  })
}

// exported functions
const uploadPosts = () => {
  getUploadPromises()
    .then(uploadPromises => {
      Promise.all(uploadPromises)
             .then(res => {
               uploadSpinner.stop();

               log(chalk.bold.green('Posts uploaded!'));
               log(chalk.bold.yellow(`run ${chalk.bold.blue('npm run generate')} or ${chalk.bold.blue('npm run dev')} to see the uploaded posts in the static site`));

               // delete the uploaded files
               uploadedFileNames.forEach( fileName => {
                let deleteFileName = path.join(ROOT_DIR,'drafts',fileName);
                rimraf.sync(deleteFileName);
               });

               log(chalk.bold.red(`the uploaded post is deleted from drafts`));
             })
             .catch(err=>{
               uploadSpinner.stop();
               log(chalk.bold.red('Could not upload'));
               console.log(err);
             });
    })
    .catch( err => {
        log(chalk.bold.red(err.message));
    })
}

const generateTheme = () => {
        //
}

module.exports = {
  uploadPosts
}
