// init nunjucks, githubblog api and env vars
const path = require('path');
const _nunjucks = require('./nunjucks_config.js');
const gitblog = require('github-blog-api');
const bc = require('../blog_config.json');

module.exports = {
  init: ()=>{
    process.env.ROOT_DIR = path.resolve('.');
    const nunjucks = _nunjucks.init();
    const blog = gitblog({username:bc.username,repo:bc.repo,author:bc.author});
    blog.setPost({per_page:bc.posts_per_page});
    return {blog,nunjucks};
  }
}

