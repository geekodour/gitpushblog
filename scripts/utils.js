var mkdirp = require('mkdirp');
var chalk = require('chalk');
var marked = require('marked');
var fs = require('fs');
var slug = require('slug');
var path = require('path');
var _nunjucks = require('./nunjucks_config.js');
var bc = require('../blog_config.json');


// inits
var ROOT_DIR = path.resolve('.');
var nunjucks = _nunjucks.init();

module.exports = {
  createdir: function(dirpath){
        return new Promise((resolve,reject)=>{
                  mkdirp(dirpath, function (err) {
                      if (err) reject(err);
                      resolve();
                  });
               });
        },

  generatePostTemplate: function(post,labels,dirName){
        var fileName = slug(post.title)+".html";
        // marked is required for offline support
        // the `body.html` does already exist when using the api
        post.html = marked(post.body);
        var renderContent = nunjucks.render('post_page.html',
          {
            post: post,
            labels: labels,
            comment: bc.comment,
            comment_system: bc.comment.system,
            disqus_id: bc.comment.disqus_id,
            firebaseEnabled: bc.comment.firebaseEnabled
          }
        );
        // use `path` for windows support
        // probably will break now
        fs.writeFile(ROOT_DIR+"/"+dirName+"/posts/"+fileName, renderContent, function(err) {
            if(err) { return console.log(err); }
        });
        },

  generateIndexTemplate: function(posts,labels,dirName,fileName){
        // index template generation
        var renderContent = nunjucks.render('index.html',{posts:posts,labels:labels});
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
                        fs.writeFileSync(ROOT_DIR+"/"+dirName+"/category/"+label.name+".html", renderContent);
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
        }
};
