'use strict';

const mkdirp = require('mkdirp');
const marked = require('marked');
const fs = require('fs');
const slugify = require('slugify');
const path = require('path');
const _nunjucks = require('./nunjucks_config.js');
const bc = require('../blog_config.json');
const init = require('./init');


// init nunjucks and blog and env variables
const {nunjucks} = init.init();

// inits
const ROOT_DIR = process.env.ROOT_DIR;
const THEME_DIR = path.join(ROOT_DIR,'themes',bc.meta.blog_theme);
const DIR_NAME = process.env.NODE_ENV === 'production'?'dist':'dev'; // output directory
//const nunjucks = _nunjucks.init();

module.exports = {

  generatePostTemplate: function(post,labels,dirName=DIR_NAME){
        let fileName = post.slug+'.html';
        // marked is required for offline support, the `body.html` already exists
        // when using the api. Maybe put a check for that?
        post.html = marked(post.body);
        let renderContent = nunjucks.render('post_page.html',
          {
            meta: bc.meta,
            bc: bc,
            comment: bc.comment,
            post: post,
            labels: labels
          }
        );
        fs.writeFile(path.join(ROOT_DIR,dirName,'posts',fileName), renderContent, function(err) {
            if(err) { return console.log(err); }
        });
  },

  generateIndexTemplate: function(posts,labels,pagination,dirName=DIR_NAME,fileName){
        // index template generation
        var renderContent = nunjucks.render('index.html',
          {
            meta: bc.meta,
            bc: bc,
            posts:posts,
            labels:labels,
            pagination:pagination
          }
        );
        // should we make this writeFile sync? or make all writeFile async?
        fs.writeFile(path.join(ROOT_DIR,dirName,fileName), renderContent, function(err) {
            if(err) { return console.log(err); }
        });
  },

  generateCategoryTemplates: function(labels,dirName=DIR_NAME){
        // takes array of labels
        // creates files with name label.slug.html
        return labels.map(function(label){
          return new Promise(function(resolve,reject){
                  var renderContent = nunjucks.render('category_page.html',
                    {
                      meta: bc.meta,
                      bc: bc,
                      label:label,
                      labels:labels
                    }
                  );
                  fs.writeFileSync(path.join(ROOT_DIR,dirName,'category',label.slug+'.html'),renderContent);
                  resolve();
          });
        });
  },

  generatePageTemplate: function(dirName=DIR_NAME){
        var pageTemplatesFiles = fs.readdirSync(path.join(THEME_DIR,'pages'));
        pageTemplatesFiles.forEach(function(fileName){
          var renderContent = nunjucks.render(path.join('pages',fileName),
            {
              meta: bc.meta,
              bc: bc
            }
          );
          fs.writeFileSync(path.join(ROOT_DIR,dirName,fileName),renderContent);
        });
  },

  getOfflineFileContents: function(){
        let fileNames = fs.readdirSync(path.join(ROOT_DIR,'drafts'));
        return fileNames.map(fileName=>{
                return new Promise((resolve)=>{
                       let content = fs.readFileSync(path.join(ROOT_DIR,'drafts',fileName),{encoding:"utf8"});
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
