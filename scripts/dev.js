'use strict';

/*
 *  STYLE IS INCONSISTET
 *  SOULD I MAKE THE SCRIPT ES6 OR ES5???
 * */

process.env.NODE_ENV = 'development';

var chokidar = require('chokidar');
var server = require('pushstate-server');
var rimraf = require('rimraf');
var chalk = require('chalk');
var slug = require('slug');
var fs = require('fs');
var marked = require('marked');
var mkdirp = require('mkdirp');
var path = require('path');
var gitblog = require('github-blog-api');
var _nunjucks = require('nunjucks');
var bc = require('../blog_config.json');

var ROOT_DIR = path.resolve('.');

/* * * * * * * * * * * * *
 * nunjucks configuration
 * * * * * * * * * * * * * */
var nunjucks = _nunjucks.configure(ROOT_DIR+'/views', { autoescape: true, trimBlocks: true, lstripBlocks: true, watch: true});

// slug filter
nunjucks.addFilter('slug', function(str, count) {
   return slug(str)+".html";
});


/* * * * * * * * * * * *
 * Helper functions
 * * * * * * * * * * * */

function createdir(dirpath){
        return new Promise((resolve,reject)=>{
                mkdirp(dirpath, function (err) {
                    if (err) reject(err);
                    resolve();
                });
        })
}

/* * * * * * * * * * * *
 * Template generation
 * * * * * * * * * * * */

function generatePostTemplate(post){
        // post_page template generation

        var fileName = slug(post.title)+".html";
        // marked is required for offline support in dev mode
        post.html = marked(post.body);
        var renderContent = nunjucks.render('post_page.html',{post: post, comment_system: bc.comment_system, disqus_id: bc.disqus_id});
        fs.writeFile(ROOT_DIR+"/dev/posts/"+fileName, renderContent, function(err) {
            if(err) { return console.log(err); }
        });
}

function generateIndexTemplate(posts,fileName,labels){
        // index template generation

        var renderContent = nunjucks.render('index.html',{posts:posts,labels:labels});
        fs.writeFile(ROOT_DIR+"/dev/"+fileName+".html", renderContent, function(err) {
            if(err) { return console.log(err); }
        });
}

function generateCategoryTemplates(labels){
        return labels.map(function(label){
                return new Promise(function(resolve,reject){
                        var renderContent = nunjucks.render('category_page.html',{label:label});
                        fs.writeFileSync(ROOT_DIR+"/dev/category/"+label.name+".html", renderContent);
                        resolve();
                });
        });
}

function generatePageTemplate(){
        var pageTemplatesFiles = fs.readdirSync(ROOT_DIR+"/views/pages");
        pageTemplatesFiles.forEach(function(fileName){
          var renderContent = nunjucks.render('pages/'+fileName,{});
          fs.writeFileSync(ROOT_DIR+"/dev/"+fileName, renderContent);
        });
}

function generateTemplates(){
        // use the generateTemplate functions

        let flatPosts = posts.reduce((posts_prev,posts_next)=>posts_prev.concat(posts_next));

        posts.forEach(function(post_arr,i){
                if(i==0){
                  generateIndexTemplate(post_arr,'index',labels);
                }
                else{
                  generateIndexTemplate(post_arr,i+1,labels);
                }
        });

        // post_page.html
        flatPosts.forEach(function(post){
                generatePostTemplate(post);
        });
        rev++;
        console.log("REVISION "+rev+" GENERATED.");
}


/* * * * * * * * * * * *
 * fetch github data
 * * * * * * * * * * * */

function fetchAndStoreData(_labels){
  blog.fetchBlogPosts()
      .then(function(_posts){

            posts.push(_posts);

            if(!blog.settings.posts.last_reached){

                    console.log(chalk.bold.yellow('\nFetching posts...'));
                    fetchAndStoreData(_labels);
            }
            else {
                    console.log(chalk.bold.green('Fetching finished!'));
                    posts[0].unshift(...listOfFiles)
                    labels = _labels;
                    startDevMode();
            }
      })
      .catch(function(err){
            console.log(chalk.bold.green('Could not fetch github data for some reason\nUsing offline data.'));
            posts.push(listOfFiles)
            startDevMode();
      });
}

function fetchFilesAndStoreData(){
        // is there a async redfile?
        return new Promise(function(resolve,reject){
          var offlineFilesDir = ROOT_DIR+"/content/";
          var data = {};
          readFiles(offlineFilesDir, function(filename, content) {
            data[filename] = content;
          }, function(err) {
            throw err;
          });
          resolve(data);
        });
}


function readFiles(dirname, onFileContent, onError) {
  fs.readdir(dirname, function(err, filenames) {
    if (err) {
      onError(err);
      return;
    }
    filenames.forEach(function(filename) {
      fs.readFile(dirname + filename, 'utf-8', function(err, content) {
        if (err) {
          onError(err);
          return;
        }
        onFileContent(filename, content);
      });
    });
  });
}

/* * * * * * * * * * * *
 * Dev mode
 * * * * * * * * * * * */

function startDevMode(){

              // create category directory
              createdir(ROOT_DIR+'/dev/category')
                .then(e=>{
                  // create category pages
                  Promise.all(generateCategoryTemplates(labels))
                          .then(()=>{
                                  // create posts directory
                                  createdir(ROOT_DIR+'/dev/posts')
                                          .then(e=>{
                                                  // create index and post pages
                                                  generateTemplates();
                                                  // generate other pages
                                                  generatePageTemplate();
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
                fetchFilesAndStoreData()
                .then(data=>{
                  let fileContents = prepareFileContents();
                  Promise.all(fileContents).then(()=>{
                    fetchAndStoreData(_labels);
                  });
                })
        })
        .catch(err=>{
                console.log("Could not fetch label data due to network error.")
                fetchFilesAndStoreData()
                .then(()=>{
                  let fileContents = prepareFileContents();
                  Promise.all(fileContents).then(()=>{
                    fetchAndStoreData(labels);
                  });
                })
        })


// start the dev server silently
server.start({
  port: 3000,
  directory: ROOT_DIR+'/dev'
});
