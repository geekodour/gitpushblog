import './main.sass';
import gitBlog from 'github-blog-api';
import { disqusService, firebaseService } from './services';

const myblog = gitBlog({username:'lukego',repo:'blog',author:'lukego'});
const blogInfo = window.blogInfo;
myblog.setPost({per_page:3});
myblog.setComment({per_page:3});

// we put `window.blogInfo` object when
// generating the nunjucks templates

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
        return `<a href="/posts/${post.slug}" class="title is-4">${post.title}</a>`
}

const updateLoadMoreButtonHTML = (classAttr='')=>{
        let loadMoreContainer = document.getElementById('loadmore_container');
        loadMoreContainer.innerHTML = `<div class="button is-danger ${classAttr}" id="loadmore_button">Load more</div>`;
}

const generateLoadMoreButton = (iterator)=>{
        // assign events and loadMoreButton based on iterator type
        let loadMoreContainer = document.getElementById('loadmore_container');
        switch(iterator){
                case "post":
                        if(!myblog.settings.posts.last_reached){
                                //loadMoreContainer.innerHTML = getLoadMoreButtonHTML();
                                updateLoadMoreButtonHTML();
                                document.getElementById("loadmore_button").addEventListener("click", insertCategoryMatches);
                        }
                        else{
                                loadMoreContainer.innerHTML = "<p>All posts loaded!</p>";
                        }
                        break;
                case "comment":
                        if(myblog.settings.comments.done_posts.indexOf(blogInfo.postId) === -1){
                                //loadMoreContainer.innerHTML = getLoadMoreButtonHTML();
                                updateLoadMoreButtonHTML();
                                document.getElementById("loadmore_button").addEventListener("click", updateComments);
                        }
                        else{
                                loadMoreContainer.innerHTML = "<p>All comments loaded!</p>";
                        }
                        break;
        }
}

const updateComments = ()=>{
    let commentsContainer = document.getElementById('comments_container');
    let postId = blogInfo.postId;
    updateLoadMoreButtonHTML('is-loading');
    myblog.fetchBlogPostComments(postId).then(comments=>{
            generateLoadMoreButton("comment");
            comments.forEach(comment=>{
              commentsContainer.innerHTML += getCommentHTML(comment);
            });
    });

}

const insertCategoryMatches = ()=>{
  // calls fetchBlogPosts with label as the parameter
  let postsContainer = document.getElementById('category_posts_container');
  let label = blogInfo.label;
  updateLoadMoreButtonHTML('is-loading');
  myblog.fetchBlogPosts([label]).then(posts=>{
          generateLoadMoreButton("post");
          posts.forEach(post=>{
                  postsContainer.innerHTML += getPostListItemHTML(post);
          });
  });
}

const initCommentSystem = ()=>{
  if(!blogInfo.comment.disabled){
    let commentsContainer = document.getElementById('comments_container');

    if(blogInfo.comment.isGithub){
      updateComments();
      if(blogInfo.comment.isGithubAuth){
              firebaseService.init();
              document.getElementById("signin_button").addEventListener("click", firebaseService.signIn);
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
                insertCategoryMatches();
                break;
        default:
                break;
}
