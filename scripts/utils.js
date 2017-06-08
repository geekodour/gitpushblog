var mkdirp = require('mkdirp');
var chalk = require('chalk');
var marked = require('marked');
var fs = require('fs');
var slugify = require('slugify');
var path = require('path');
var _nunjucks = require('./nunjucks_config.js');
var bc = require('../blog_config.json');


// inits
var ROOT_DIR = path.resolve('.');
var nunjucks = _nunjucks.init();

module.exports = {

  generatePostTemplate: function(post,labels,dirName){
        var fileName = post.slug+'.html';
        // marked is required for offline support
        // the `body.html` does already exist when using the api
        post.html = marked(post.body);
        var renderContent = nunjucks.render('post_page.html',
          {
            post: post,
            labels: labels,
            comment: bc.comment
          }
        );
        // use `path` for windows support
        // probably will break now
        fs.writeFile(ROOT_DIR+"/"+dirName+"/posts/"+fileName, renderContent, function(err) {
            if(err) { return console.log(err); }
        });
        },

  generateIndexTemplate: function(posts,labels,pagination,dirName,fileName){
        // index template generation
        var renderContent = nunjucks.render('index.html',{posts:posts,labels:labels,pagination:pagination});
        fs.writeFile(ROOT_DIR+"/"+dirName+"/"+fileName, renderContent, function(err) {
            if(err) { return console.log(err); }
        });
        },

  generateCategoryTemplates: function(labels,dirName){
        // takes array of labels
        // creates files with name label.slug.html
        return labels.map(function(label){
                return new Promise(function(resolve,reject){
                        var renderContent = nunjucks.render('category_page.html',{label:label,labels:labels});
                        fs.writeFileSync(ROOT_DIR+"/"+dirName+"/category/"+label.slug+".html", renderContent);
                        resolve();
                });
        });
        },

  generatePageTemplate: function(dirName){
        var pageTemplatesFiles = fs.readdirSync(ROOT_DIR+"/views/pages");
        pageTemplatesFiles.forEach(function(fileName){
          var renderContent = nunjucks.render('pages/'+fileName,{});
          fs.writeFileSync(ROOT_DIR+"/"+dirName+"/"+fileName, renderContent);
        });
        },

  getOfflineFileContents: function(){
        var fileNames = fs.readdirSync(ROOT_DIR+"/content");
        return fileNames.map(fileName=>{
                return new Promise((resolve)=>{
                       let content = fs.readFileSync(ROOT_DIR+"/content/"+fileName,{encoding:"utf8"});
                       let post = {};
                       // this part really need a good fix
                       post.title = content.split("\n")[0].split(" ").slice(1).join(' ').trim();
                       post.body = content.split("\n").slice(1).join("\n");
                       post.slug = slugify(post.title);
                       resolve(post);
                });
        });
        }
};
