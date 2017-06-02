'use strict';

var chalk = require('chalk');
var fs = require('fs');
var marked = require('marked');
var mkdirp = require('mkdirp');
var path = require('path');
var gitblog = require('github-blog-api');
var bc = require('../blog_config.json');
var _nunjucks = require('nunjucks');

var ROOT_DIR = path.resolve('.');

require('dotenv').config({path:ROOT_DIR+"/.env"});


function prepareFileContents(){
        var fileNames = fs.readdirSync(ROOT_DIR+"/content");
        return fileNames.map(fileName=>{
                return new Promise((resolve)=>{
                       let content = fs.readFileSync(ROOT_DIR+"/content/"+fileName,{encoding:"utf8"});
                       let post = {};
                       // The parsing done here is very bad probably
                       // please suggest improvements
                       // also might add a post.labels property?
                       post.title = content.split("\n")[0].split(" ").slice(1).join(' ').trim();
                       post.body = content.split("\n").slice(1).join("\n");
                       postsArray.push(post);
                       resolve();
                });
        });
}


var blog = gitblog({username:bc.username,repo:bc.repo,author:bc.author});
var postsArray = [];
blog.setPost({per_page:bc.posts_per_page});

var offlineFiles = prepareFileContents();
Promise.all(offlineFiles).then(()=>{
        var uploadPosts = postsArray.map(function(post){
                return new Promise((resolve,reject)=>{
                        blog.createPost(post,process.env.GITHUB_API_TOKEN)
                                .then(e=>{resolve();})
                                .catch(e=>{reject();});
                });
        });
        Promise.all(uploadPosts).then(()=>{
                // TODO: delete posts from ../contents
                console.log("posts have been uploaded!")
        });
});

