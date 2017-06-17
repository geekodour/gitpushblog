import './main.sass';
import gitBlog from 'github-blog-api';
import { disqusService, firebaseService } from './services';
const bc = require('../blog_config.json');

const myblog = gitBlog({username:bc.username,repo:bc.repo,author:bc.author});
const blogInfo = window.blogInfo;
myblog.setPost({per_page:3});
myblog.setComment({per_page:3});

// we put `window.blogInfo` object when
// generating the nunjucks templates

const handleSignInAndComment = ()=>{
  // get commentbox
  let commentEl = document.querySelector('.textarea');
  if(commentEl.value){
    document.getElementById('comment-error-box').classList.add('is-hidden');

    firebaseService.signIn()
      .then(token=>{
        // use token to create comment
        myblog.createComment({body:commentEl.value},blogInfo.postId,token)
              .then(comment=>{
                // update comment thread
                let commentsContainer = document.getElementById('comments_container');
                commentsContainer.insertAdjacentHTML('beforeend', getCommentHTML(comment));
              });
      });
  }
  else{
    document.getElementById('comment-error-box').classList.remove('is-hidden');
  }
}

const getCommentHTML = (comment)=>{
  // return html needed for comments
  if(blogInfo.comment.isGithub){
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

const getPostListItemHTML = (post)=>{
        return `<li><a href="/posts/${post.slug}" class="title is-4">${post.title}</a></li>`
}

const updateLoadMoreButtonHTML = (classAttr='')=>{
        let loadMoreContainer = document.getElementById('loadmore_container');
        loadMoreContainer.innerHTML = `<div class="button is-danger ${classAttr}" id="loadmore_button">Load more</div>`;
}

const generateLoadMoreButton = (iterator)=>{
        // assign events to loadMoreButton based on iterator type
        let loadMoreContainer = document.getElementById('loadmore_container');
        switch(iterator){
                case "post":
                        if(!myblog.settings.posts.last_reached){
                                updateLoadMoreButtonHTML();
                                document.getElementById("loadmore_button").addEventListener("click", updateCategoryList);
                        }
                        else{
                                loadMoreContainer.innerHTML = "<p>All posts loaded!</p>";
                        }
                        break;
                case "comment":
                        if(myblog.settings.comments.done_posts.indexOf(blogInfo.postId) === -1){
                                updateLoadMoreButtonHTML();
                                document.getElementById("loadmore_button").addEventListener("click", updateGithubComments);
                        }
                        else{
                                loadMoreContainer.innerHTML = "<p>All comments loaded!</p>";
                        }
                        break;
        }
}

const updateGithubComments = ()=>{
    let commentsContainer = document.getElementById('comments_container');
    let postId = blogInfo.postId;
    updateLoadMoreButtonHTML('is-loading');

    myblog.fetchBlogPostComments(postId).then(comments=>{
            generateLoadMoreButton("comment");
            comments.forEach(comment=>{
              commentsContainer.insertAdjacentHTML('beforeend', getCommentHTML(comment));
            });
    });
}

const updateCategoryList = ()=>{
  let postsContainer = document.getElementById('category_posts_container');
  updateLoadMoreButtonHTML('is-loading');

  myblog.fetchBlogPosts([blogInfo.label]).then(posts=>{
          generateLoadMoreButton("post");
          posts.forEach(post=>{
             postsContainer.insertAdjacentHTML('beforeend', getPostListItemHTML(post));
          });
  });
}

const initCommentSystem = ()=>{
  if(!blogInfo.comment.disabled){
    let commentsContainer = document.getElementById('comments_container');

    if(blogInfo.comment.isGithub){
      updateGithubComments();
      if(blogInfo.comment.isGithubAuth){
              firebaseService.init();
              document.getElementById("signin_button").addEventListener("click", handleSignInAndComment);
      }
    }

    else if(blogInfo.comment.isDisqus){
      commentsContainer.innerHTML += getCommentHTML();
      disqusService.init();
    }
  }
}

// run instructions based on pageType
switch(window.blogInfo.pageType){
        case "index":
                break;
        case "post":
                initCommentSystem();
                break;
        case "category":
                updateCategoryList();
                break;
        default:
                break;
}
