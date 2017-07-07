// init nunjucks, githubblog api and env vars
const fs = require('fs');
const path = require('path');
const _nunjucks = require('./nunjucks_config.js');
const gitblog = require('github-blog-api');
const yaml = require('js-yaml');

module.exports = {
  init: ()=>{
    process.env.ROOT_DIR = path.resolve('.');
    const ROOT_DIR = process.env.ROOT_DIR;
    const bc = yaml.safeLoad(fs.readFileSync(path.join(ROOT_DIR,'_config.yml'), 'utf8'));
    const nunjucks = _nunjucks.init();
    const blog = gitblog({username:bc.username,repo:bc.repo,author:bc.author});
    blog.setPost({per_page:bc.posts_per_page});
    return {blog,nunjucks,bc};
  }
}

