'use strict';
process.env.NODE_ENV = 'production';

var path = require('path');
var ora = require('ora');
var rimraf = require('rimraf');
var fs = require('fs');
var gitblog = require('github-blog-api');
var bc = require('../blog_config.json');
var utils = require('./utils.js');

var ROOT_DIR = path.resolve('.');
var spinner = ora({text:'Fetching posts',spinner:'line'});

require('dotenv').config({path:ROOT_DIR+"/.env"});

var blog = gitblog({username:bc.username,repo:bc.repo,author:bc.author});
blog.setPost({per_page:bc.posts_per_page});


function uploadFiles(offlineFileContents){
  var uploadPromises = offlineFileContents.map(function(post){
    return blog.createPost(post,process.env.GITHUB_AUTH_TOKEN);
  });
  Promise.all(uploadPromises)
         .then(()=>{
           spinner.stop();
           console.log('posts uploaded successfully');
           rimraf.sync(ROOT_DIR+'/drafts/*');

         })
         .catch(err=>{
                 spinner.stop();
                 console.log('network error inside');
                 console.log(err);
         });
}

var fileContents = utils.getOfflineFileContents();
Promise.all(fileContents)
       .then((offlineFileContents)=>{
          spinner.start();
          uploadFiles(offlineFileContents);
        })
        .catch(err=>{
                console.log('error with files');
        });
