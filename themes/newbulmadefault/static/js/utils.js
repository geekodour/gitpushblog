/* note:
 * if you're using some framework like react
 * you probaly can take out chunks out of this file
 * but i'll suggest rewriting them the rect way
 *
 * This file includes functions for loading more posts,comments,signin for comments
 * => suggest a better name than `utils.js`?maybe?
 *
 * in `const bc = require('../blog_config.json');` `webpack` is enabling us to use
 * data from our `blog_config.json` in this file. If you're NOT using `webpack`
 * then you might want to use the data available at `window.blogInfo` which is
 * passed during template generation to each and every page
 *
 * FIX NOTE: pass whole blog_config+otherstuff into window.blogInfo else this will be
 * unusable without webpack
 * */

import gitBlog from 'github-blog-api';
import { disqusService, firebaseService } from './services';

//const bc = require('../blog_config.json');
const bc = window.blogInfo.bc;
const blogInfo = window.blogInfo;

const myblog = gitBlog({username:bc.username,repo:bc.repo,author:bc.author});
myblog.setPost({per_page:bc.posts_per_page});
myblog.setComment({per_page:bc.comments_per_page});

// get all the required DOM elements for posts and comments
const commentText = document.querySelector('#comment_box .textarea');
const commentsContainer = document.getElementById('comments_container');
const commentError = document.getElementById('comment-error-box');
const loadMoreContainer = document.getElementById('loadmore_container');
const loadMoreButton = document.getElementById('loadmore_button');
const postsContainer = document.getElementById('category_posts_container');
const signInButton = document.getElementById("signin_button");


const handleSignInAndComment = () => {

  if(commentText.value){
    // hide error message
    commentError.classList.add('is-hidden');

    firebaseService.signIn()
      .then(token=>{
        myblog.createComment({body:commentText.value},blogInfo.postId,token)
           .then(comment=>{
             // update comment thread
             commentsContainer.insertAdjacentHTML('beforeend', getCommentHTML(comment));
           });
      });
  }
  else{
    commentError.classList.remove('is-hidden');
  }
}


const getCommentHTML = comment => {
  // return html needed for comments
  // please modify these according to the css library you use
  // by default it's using css classes from [bulma](https://bulma.io)
  if(bc.comment.isGithub){
    return `<div class="box">
      <article class="media">
        <div class="media-left">
          <figure class="image is-64x64">
            <img src="${comment.user.avatar_url}" alt="">
          </figure>
        </div>
        <div class="media-content">
          <div class="content">
            <p>
              <strong>${comment.user.username}</strong>
              ${comment.html}
            </p>
          </div>
        </div>
      </article>
    </div>`;
  }
  else{
    return `<div id="disqus_thread"></div>`;
  }
}


const getPostListItemHTML = post => {
        // by default it's using css classes from [bulma](https://bulma.io)
        return `<li><a href="/posts/${post.slug}" class="title is-4">${post.title}</a></li>`
}

const generateLoadMoreButton = iterator => {
        // assign events to loadMoreButton based on iterator type
        // this function handles `loadMoreButton` for posts and comments
        // if you have a more complicated logic for handling loading button
        // the modify this
        loadMoreButton.classList.remove('is-loading');
        switch(iterator){
          case "post":
                if(!myblog.settings.posts.last_reached){
                        loadMoreButton.addEventListener("click", updateCategoryList);
                }
                else{ loadMoreContainer.innerHTML = "<p>All posts loaded!</p>"; }
                break;
          case "comment":
                if(myblog.settings.comments.done_posts.indexOf(blogInfo.postId) === -1){
                        loadMoreButton.addEventListener("click", updateGithubComments);
                }
                else{ loadMoreContainer.innerHTML = "<p>All comments loaded!</p>"; }
                break;
          default:
                break;
        }
}

const updateGithubComments = ()=>{
    loadMoreButton.classList.add('is-loading');

    myblog.fetchBlogPostComments(blogInfo.postId).then(comments=>{
            generateLoadMoreButton("comment");
            comments.forEach(comment=>{
              commentsContainer.insertAdjacentHTML('beforeend', getCommentHTML(comment));
            });
    });
}


export const updateCategoryList = () => {
  // we could have generated the items in category
  // page using nunjucks, just using an alternative here
  loadMoreButton.classList.add('is-loading');

  // fetchBlogPosts takes `[]` of labels
  // fetchBlogPosts probaly does not handle
  // this properly, need to fix
  myblog.fetchBlogPosts([blogInfo.label]).then(posts=>{
          generateLoadMoreButton("post");
          posts.forEach(post=>{
             postsContainer.insertAdjacentHTML('beforeend', getPostListItemHTML(post));
          });
  });
}


export const initCommentSystem = () => {
  if(!bc.comment.disabled){
    if(bc.comment.isGithub){
      updateGithubComments();
      if(bc.comment.isGithubAuth){
              firebaseService.init();
              signInButton.addEventListener("click", handleSignInAndComment);
      }
    }
    else if(bc.comment.isDisqus){
      commentsContainer.innerHTML += getCommentHTML();
      disqusService.init();
    }
  }
}
