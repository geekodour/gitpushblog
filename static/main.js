import './main.sass';
import gitBlog from 'github-blog-api';

const myblog = gitBlog({username:'lukego',repo:'blog',author:'lukego'});
myblog.setComment({per_page:3});

// we put `window.blogInfo` object when
// generating the nunjucks templates


const generateComment = (comment)=>{
        switch(window.blogInfo.comment_system){
                case "github":
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
                        </div>`
                        break;
                case "disqus":
                        let disqus_developer = 1;
                        let disqus_config = function () {
                        this.page.url = "${location.href}"
                        this.page.identifier = "${location.href}";
                        };
                        (function() { // DON'T EDIT BELOW THIS LINE
                        var d = document, s = d.createElement('script');
                        s.src = 'https://geekodour.disqus.com/embed.js';
                        s.setAttribute('data-timestamp', +new Date());
                        (d.head || d.body).appendChild(s);
                        })();
                        return `<div id="disqus_thread"></div>`
                        break;
                default:
                        break;
        }
}

const generatePostListItem = (post)=>{
        return ` <h4 class="title is-4"> ${post.title} </h4> `
}

const loadMoreButton = (iterator)=>{
                return `
                  <div class="button is-danger" id="loadmore_button">Load more ${iterator}s</div>
                `
}

const generateLoadMoreButton = (iterator)=>{
        let loadMoreContainer = document.getElementById('loadmore_container');
        switch(iterator){
                case "post":
                        if(!myblog.settings.posts.last_reached){
                                        loadMoreContainer.innerHTML = loadMoreButton(iterator);
                                        document.getElementById("loadmore_button").addEventListener("click", insertCategoryMatches);
                        }
                        else{
                                loadMoreContainer.innerHTML = "<p>All posts loaded!</p>";
                        }
                        break;
                case "comment":
                        if(myblog.settings.comments.done_posts.indexOf(window.blogInfo.postId) === -1){
                                loadMoreContainer.innerHTML = loadMoreButton(iterator);
                                document.getElementById("loadmore_button").addEventListener("click", insertComments);
                        }
                        else{
                                loadMoreContainer.innerHTML = "<p>All comments loaded!</p>";
                        }
                        break;
        }
}

const insertComments = ()=>{
  let commentsContainer = document.getElementById('comments_container');
  if(window.blogInfo.comment_system === "github"){
    let postId = window.blogInfo.postId;
    myblog.fetchBlogPostComments(postId).then(comments=>{
            generateLoadMoreButton("comment");
            comments.forEach(comment=>{
              commentsContainer.innerHTML += generateComment(comment);
            });
    });
  }
  else if(window.blogInfo.comment_system === "disqus"){
    commentsContainer.innerHTML += generateComment();
    document.querySelector('body').innerHTML += `<script id="dsq-count-scr" src="//geekodour.disqus.com/count.js" async></script>`;
  }
  else{
          // do nothing
  }
}

const insertCategoryMatches = ()=>{
  let label = window.blogInfo.label;
  let postsContainer = document.getElementById('category_posts_container');
  myblog.fetchBlogPosts([label]).then(posts=>{
          generateLoadMoreButton("post");
          posts.forEach(post=>{
                  postsContainer.innerHTML += generatePostListItem(post);
          });
  });
}

switch(window.blogInfo.pageType){
        case "index":
                break;
        case "post":
                insertComments();
                break;
        case "category":
                insertCategoryMatches();
                break;
}
