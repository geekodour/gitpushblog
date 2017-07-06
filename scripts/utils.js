'use strict';

const mkdirp = require('mkdirp');
const marked = require('marked');
const fs = require('fs');
const map = require('async/map');
const slugify = require('slugify');
const path = require('path');
const yamlFront = require('yaml-front-matter');
const _nunjucks = require('./nunjucks_config.js');
const bc = require('../blog_config.json');
const init = require('./init');

// init nunjucks and blog and env variables
const {nunjucks} = init.init();

// inits
const ROOT_DIR = process.env.ROOT_DIR;
const THEME_DIR = path.join(ROOT_DIR,'themes',bc.meta.blog_theme);
const DIR_NAME = process.env.NODE_ENV === 'production'?'dist':'dev'; // output directory

// non-exported functions
const createPostObject = (fileName,cb) =>{
         let content = fs.readFileSync(path.join(ROOT_DIR,'drafts',fileName),{encoding:"utf8"});
         const post = yamlFront.loadFront(content);
         post.slug = slugify(post.title);
         post.html = marked(post.__content);
         post.labels = post.labels.map(label=>({name:label}))
         cb(null,post);
}

// exported functions
const generatePostTemplate = (post,labels,dirName=DIR_NAME)=>{
      let fileName = post.slug+'.html';
      let renderContent = nunjucks.render('post_page.html',
        {
          meta: bc.meta,
          bc: bc,
          comment: bc.comment,
          post: post,
          labels: labels
        }
      );
      fs.writeFile(path.join(ROOT_DIR,dirName,'posts',fileName), renderContent, (err) => {
          if(err) { console.log("disk error"); }
      });
}

const generateIndexTemplate = (posts,labels,pagination,dirName=DIR_NAME,fileName) => {
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
        fs.writeFile(path.join(ROOT_DIR,dirName,fileName), renderContent, (err) => {
            if(err) { return console.log(err); }
        });
}

const generateCategoryTemplates = (labels,dirName=DIR_NAME) => {
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
                  //fs.writeFileSync(path.join(ROOT_DIR,dirName,'category',label.slug+'.html'),renderContent);
                  fs.writeFile(path.join(ROOT_DIR,dirName,'category',label.slug+'.html'),renderContent, (err) => {
                    if(err) { return console.log(err); }
                    resolve();
                  });
          });
        });
}

const generateCategoryTemplates2 = (labels,dirName=DIR_NAME) => {
        labels.forEach((label)=>{
          const renderContent = nunjucks.render('category_page.html',
            {
              meta: bc.meta,
              bc: bc,
              label:label,
              labels:labels
            }
          );
          fs.writeFile(path.join(ROOT_DIR,dirName,'category',`${label.slug}.html`),renderContent, (err) => {
            if(err) { return console.log(err); }
          });
        });
}

const generatePageTemplate = (dirName=DIR_NAME) => {
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
}


const getOfflineFileContents = () => {
        return new Promise((resolve,reject)=>{
          let fileNames = fs.readdirSync(path.join(ROOT_DIR,'drafts'));
          fileNames = fileNames.filter(fileName => !/~$/.test(fileName)) // needed to skip backup~ files
          // using async map here, any idea how we'll do it without async map?
          map(fileNames, createPostObject, function(err, posts) {
            resolve(posts);
          });
        });
}

const generatePagination = (pagination,posts,cur_page) => {
        // no. of `post_arrs` === no. of pages
        // i.e `posts.length` === no. of pages
        // `cur_page` is the index from forEach

        return Object.assign(pagination,
          {
            next: (posts.length === cur_page+1) ? 0 : cur_page+2,
            prev: cur_page > 0
                  ? cur_page == 1 ? 'index' : cur_page
                  : 0
          }
        );
}

module.exports = {
        generatePostTemplate,
        generateIndexTemplate,
        generateCategoryTemplates,
        generateCategoryTemplates2,
        generatePageTemplate,
        getOfflineFileContents,
        generatePagination
};
