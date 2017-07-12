// init nunjucks, githubblog api and env vars
const fs = require('fs');
const path = require('path');
const _nunjucks = require('./nunjucks_config.js');
const gitblog = require('github-blog-api');
const yaml = require('js-yaml');
const slug = require('slug');

module.exports = {
  init: ()=>{
    process.env.ROOT_DIR = path.resolve('.');
    const ROOT_DIR = process.env.ROOT_DIR;

    const bc = yaml.safeLoad(fs.readFileSync(path.join(ROOT_DIR,'_config.yml'), 'utf8'));
    const THEME_DIR = path.join(ROOT_DIR,'themes',bc.meta.blog_theme);
    let tc = {};
    if(fs.existsSync(path.join(THEME_DIR,'_config.yml'))){
      tc = yaml.safeLoad(fs.readFileSync(path.join(THEME_DIR,'_config.yml'), 'utf8'));
    }

    const nunjucks = _nunjucks.init();

    const blog = gitblog({username:bc.username,repo:bc.repo,author:bc.author});
    blog.setPost({per_page:bc.posts_per_page});


    // init slug
    slug.defaults.modes['pretty'] = {
        replacement: '-',
        symbols: true,
        remove: /[.]/g,
        lower: true,
        charmap: slug.charmap,
        multicharmap: slug.multicharmap
    };

    return {blog,nunjucks,bc,tc,slug};
  }
}

