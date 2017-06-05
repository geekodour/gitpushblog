'use strict';

/*
 *  STYLE IS INCONSISTET
 *  MAKE THE SCRIPT ES6 OR ES5???
 * */

process.env.NODE_ENV = 'development';

var chokidar = require('chokidar');
var ora = require('ora');
var server = require('pushstate-server');
//var rimraf = require('rimraf');
var chalk = require('chalk');
//var slug = require('slug');
var fs = require('fs');
//var marked = require('marked');
//var mkdirp = require('mkdirp');
var path = require('path');
var gitblog = require('github-blog-api');
var bc = require('../blog_config.json');
var utils = require('./utils.js');
var _nunjucks = require('./nunjucks_config.js');

var ROOT_DIR = path.resolve('.');
var spinner = ora({text:'Fetching posts',spinner:'line'});

// nunjucks configuration
var nunjucks = _nunjucks.init();

// template generation
function generateTemplates(){
        let flatPosts = posts.reduce((posts_prev,posts_next)=>posts_prev.concat(posts_next));

        posts.forEach(function(post_arr,pageno){
                if(pageno==0){
                  utils.generateIndexTemplate(post_arr,labels,'dev','index.html');
                }
                else{
                  utils.generateIndexTemplate(post_arr,labels,'dev',pageno+1+'.html');
                }
        });

        flatPosts.forEach(function(post){
                utils.generatePostTemplate(post,labels,'dev');
        });

        rev++;
        console.log("REVISION "+rev+" GENERATED.");
}


// fetch github data

function fetchAndStoreData(_labels){
  spinner.start();
  blog.fetchBlogPosts()
      .then(function(_posts){

            posts.push(_posts);

            if(!blog.settings.posts.last_reached){
                    fetchAndStoreData(_labels);
            }
            else {
                    spinner.stop();
                    posts[0].unshift(...listOfFiles)
                    labels = _labels;
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
      // create category directory
      utils.createdir(ROOT_DIR+'/dev/category')
        .then(e=>{
          // create category pages
          Promise.all(utils.generateCategoryTemplates(labels,'dev'))
                  .then(()=>{
                          // create posts directory
                          utils.createdir(ROOT_DIR+'/dev/posts')
                                  .then(e=>{
                                          // create index and post pages
                                          generateTemplates();
                                          // generate other pages
                                          utils.generatePageTemplate('dev');
                                  })
                  });
        })

        // watch for changes and regenerate on change
        chokidar.watch(ROOT_DIR+'/views', {ignored: /(^|[\/\\])\../}).on('all', (event, path) => {
          if(event === "change"){
                  generateTemplates();
          }
        });
}


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
                       listOfFiles.push(post);
                       resolve();
                });
        });
}

// start the dev thing
var posts = [];
var labels = [];
var listOfFiles = [];
var rev = 0;
var blog = gitblog({username:bc.username,repo:bc.repo,author:bc.author});
blog.setPost({per_page:bc.posts_per_page});

console.log("STARTING DEV SCRIPT");
blog.fetchAllLabels()
        .then(_labels=>{
                /*
                fetchFilesAndStoreData()
                .then(data=>{
                  let fileContents = prepareFileContents();
                  Promise.all(fileContents).then(()=>{
                    fetchAndStoreData(_labels);
                  });
                })
                */
                let fileContents = prepareFileContents();
                Promise.all(fileContents).then(()=>{
                  fetchAndStoreData(_labels);
                });
        })
        .catch(err=>{
                console.log("Could not fetch label data due to network error.")
                        /*
                fetchFilesAndStoreData()
                .then(()=>{
                  let fileContents = prepareFileContents();
                  Promise.all(fileContents).then(()=>{
                    fetchAndStoreData(labels);
                  });
                })*/
                let fileContents = prepareFileContents();
                Promise.all(fileContents).then(()=>{
                  fetchAndStoreData(labels);
                });
        })


// start the dev server silently
server.start({
  port: 3000,
  directory: ROOT_DIR+'/dev'
});
