import gitBlog from 'github-blog-api';
import { disqusService, firebaseService } from './services';

const blogInfo = window.blogInfo;
const bc = blogInfo.bc;

const myblog = gitBlog({username:bc.username,repo:bc.repo,author:bc.author});
myblog.setPost({per_page:bc.posts_per_page});
myblog.setComment({per_page:bc.comments_per_page});

// get all the required DOM elements for posts and comments
const commentText = document.querySelector('#comment_box .textarea');
const commentsContainer = document.getElementById('comments_container');
const commentError = document.getElementById('comment-error-box');

const loadMoreContainer = document.getElementById('loadmore_container');
const loadMoreButton = document.getElementById('loadmore_button');

const postsListContainer = document.getElementById('category_posts_container');

const signInButton = document.getElementById("signin_button");
const signOutButton = document.getElementById("signout_button");


const handleSignInAndComment = () => {

  if(commentText.value){
    commentError.classList.remove('is-warning');
    commentError.innerText = '';

    firebaseService.signIn()
      .then(token=>{
        commentError.innerText = 'you are signed in';
        displaySignOut();
        myblog.createComment({body:commentText.value},blogInfo.postId,token)
           .then(comment=>{
             // update notification
             commentError.innerText = 'comment added!';
             // update comment thread
             commentsContainer.insertAdjacentHTML('beforeend', getCommentHTML(comment));
           });
      });
  }
  else{
    // if comment is empty
    commentError.classList.add('is-warning');
    commentError.innerText = 'your comment seems a little bit empty!';
  }
}

const handleSignOut = () => {
  firebase.auth().signOut().then(function() {
    commentError.classList.remove('is-danger');
    commentError.innerText = `signed out successfully!`;
    window.location.reload();
  }).catch(function(error) {
    commentError.classList.add('is-danger');
    commentError.innerText = `could not signout!`;
  });
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
        return `<li><a href="${blogInfo.baseurl}/posts/${post.slug}" class="title is-4">${post.title}</a></li>`
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
  //const loadMoreButton = document.getElementById('loadmore_button');
  loadMoreButton.classList.add('is-loading');

  // fetchBlogPosts takes `[]` of labels
  // fetchBlogPosts probaly does not handle
  // this properly, need to fix
  myblog.fetchBlogPosts([blogInfo.label]).then(posts=>{
          generateLoadMoreButton("post");
          posts.forEach(post=>{
             postsListContainer.insertAdjacentHTML('beforeend', getPostListItemHTML(post));
          });
  });
}


export const initCommentSystem = () => {
  if(!bc.comment.disabled){
    if(bc.comment.isGithub){
      updateGithubComments();
      if(bc.comment.isGithubAuth){
              signInButton.addEventListener("click", handleSignInAndComment);
              signOutButton.addEventListener("click", handleSignOut);
      }
    }
    else if(bc.comment.isDisqus){
      commentsContainer.innerHTML += getCommentHTML();
      disqusService.init();
    }
  }
}

export const displaySignOut = () => {
  if(firebase.auth().currentUser){
    signOutButton.classList.remove('is-hidden');
  } else {
    signOutButton.classList.add('is-hidden');
  }
}
