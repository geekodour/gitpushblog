import gitBlog from 'github-blog-api';
import { disqusService, firebaseService } from './services';

const blogInfo = window.blogInfo;
const bc = blogInfo.bc;

const myblog = gitBlog({username:bc.username,repo:bc.repo,author:bc.author});
myblog.setPost({per_page:bc.posts_per_page});
myblog.setComment({per_page:bc.comments_per_page});

const domNodes = {};
const message = {
        signedIn : `You are signed in`,
        signOutErr : `Could not signout`,
        addedComment: `Your comment is added`,
        emptyComment: `Your comment is empty, please write something`,
        allCommentsLoaded: `All comments loaded`,
        allPostsLoaded: `All posts loaded`
};

// get all the required DOM elements for posts and comments
if(bc.comment.isGithubAuth)
{
  domNodes.signInButton = document.getElementById("signin_button");
  domNodes.signOutButton = document.getElementById("signout_button");
}

if( (!bc.others.template_cat_posts && blogInfo.pageType === 'category') || (blogInfo.pageType === 'post'))
{
  domNodes.loadMoreButtonContainer = document.getElementById('loadmore_button_container');
  domNodes.loadMoreButton = document.getElementById('loadmore_button');
}

if(blogInfo.pageType === 'post')
{
  domNodes.commentsContainer = document.getElementById('comments_container');
  domNodes.commentTextarea = document.querySelector('#comments textarea');
  domNodes.commentInfoBox = document.getElementById('comment-info-box');
}

if(blogInfo.pageType === 'category')
{
  domNodes.postsListContainer = document.getElementById('category_posts_container');
}



const handleSignInAndComment = (event) => {
  event.preventDefault();
  if(domNodes.commentTextarea.value){
    firebaseService.signIn()
      .then(token=>{

        domNodes.commentInfoBox.innerText = message.signedIn;
        displaySignOut();

        myblog.createComment({body:domNodes.commentTextarea.value},blogInfo.postId,token)
           .then(comment=>{
             // update notification
             domNodes.commentInfoBox.innerText = message.addedComment;
             // update comment thread
             domNodes.commentsContainer.insertAdjacentHTML('beforeend', getCommentHTML(comment));
           });
      });
  }
  else{
    // if comment is empty, inform user
    domNodes.commentInfoBox.innerText = message.emptyComment;
  }
}

const handleSignOut = () => {
  firebase.auth().signOut()
          .then(function() {
                // reload on signout
                window.location.reload();
          })
          .catch(function(error) {
                domNodes.commentInfoBox.innerText = message.signOutErr;
          });
}


const getCommentHTML = comment => {
  // return html needed for comments
  // please modify these according to the css library you use
  // here using css classes from KeepItSimple20 Theme.
  // for disqus, no style is required
  if(bc.comment.isGithub){
    return `
       <div class="comment-content">
           <img width="50" height="50" style="margin-left: 2px" src="${comment.user.avatar_url}" alt="">
           <div class="comment-info">
              <cite>${comment.user.username}</cite>
              <div class="comment-meta">
                 <time class="comment-time" datetime="${comment.created_at}">${comment.created_at}</time>
              </div>
           </div>
           <div class="comment-text">
             ${comment.html}
           </div>
        </div>
    `;
  }
  else{
    return `<div id="disqus_thread"></div>`;
  }
}


const getPostListItemHTML = post => {
        return `<li><a href="${blogInfo.baseurl}/posts/${post.slug}" class="">${post.title}</a></li>`
}

const updateGithubComments = ()=>{
    // add `is-loading` class
    domNodes.loadMoreButton.classList.add('is-loading');
    // fetch
    myblog.fetchBlogPostComments(blogInfo.postId).then(comments=>{
            // remove `is-loading` class
            domNodes.loadMoreButton.classList.remove('is-loading');
            // append comments
            comments.forEach(comment=>{
              domNodes.commentsContainer.insertAdjacentHTML('beforeend', getCommentHTML(comment));
            });
            // update loadmore button container if all comments are loaded
            if(myblog.settings.comments.done_posts.indexOf(blogInfo.postId) > -1){
              domNodes.loadMoreButtonContainer.innerHTML = message.allCommentsLoaded;
            }
    });
}


const updateCategoryList = () => {
  // add `is-loading` class
  domNodes.loadMoreButton.classList.add('is-loading');
  // fetch
  myblog.fetchBlogPosts([blogInfo.label]).then(posts=>{
          // remove `is-loading` class
          domNodes.loadMoreButton.classList.remove('is-loading');
          // append posts
          posts.forEach(post=>{
             domNodes.postsListContainer.insertAdjacentHTML('beforeend', getPostListItemHTML(post));
          });
          // update loadmore button container if all posts are loaded
          if(myblog.settings.posts.last_reached){
            domNodes.loadMoreButtonContainer.innerHTML = message.allPostsLoaded;
          }
  });
}

export const initPostCategoryPage = () => {
  updateCategoryList();
  domNodes.loadMoreButton.addEventListener("click", updateCategoryList);
}


export const initCommentSystem = () => {
  if(!bc.comment.disabled){
    if(bc.comment.isGithub){
      // setup github comments
      updateGithubComments();
      domNodes.loadMoreButton.addEventListener("click", updateGithubComments);
      if(bc.comment.isGithubAuth){
        // setup github auth and auth comments
        domNodes.signInButton.addEventListener("click", handleSignInAndComment);
        domNodes.signOutButton.addEventListener("click", handleSignOut);
      }
    }
    else if(bc.comment.isDisqus){
      // setup disqus
      domNodes.commentsContainer.innerHTML += getCommentHTML();
      disqusService.init();
    }
  }
}

export const displaySignOut = () => {
  if(firebase.auth().currentUser){
    domNodes.signOutButton.style.display = 'block';
  } else {
    domNodes.signOutButton.style.display = 'none';
  }
}
