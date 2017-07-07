'use strict';

const fs = require('fs');
const path = require('path');
const _nunjucks = require('nunjucks');
const yaml = require('js-yaml');


module.exports = {
        init: ()=>{
          const ROOT_DIR = process.env.ROOT_DIR;
          const bc = yaml.safeLoad(fs.readFileSync(path.join(ROOT_DIR,'_config.yml'), 'utf8'));
          let nunjucks_opts = { autoescape: true, trimBlocks: true, lstripBlocks: true };

          if( process.env.NODE_ENV === "production" || process.env.NODE_ENV === "test" ){
            nunjucks_opts = Object.assign(nunjucks_opts,{watch: false});
          }
          else{
            nunjucks_opts = Object.assign(nunjucks_opts,{watch: true});
          }

          const nunjucks = _nunjucks.configure(path.join(ROOT_DIR,'themes',bc.meta.blog_theme), nunjucks_opts);

          // filters
          nunjucks.addFilter('date', function(str, count) {
             // date filter
             let dateObj = new Date(str);
             return `${dateObj.getDate()}/${+dateObj.getMonth()+1}/${dateObj.getFullYear()}`;
          });

          nunjucks.addFilter('stringify', function(obj, count) {
             // stringify filter
             return JSON.stringify(obj);
          });

          nunjucks.addFilter('addbaseurl', function(str, count) {
             // baseurl filter
             if( process.env.NODE_ENV === "development"){
                return str;
             }
             else{
               return `${bc.meta.baseurl}${str}`;
             }
          });

          return nunjucks;
        }
};
