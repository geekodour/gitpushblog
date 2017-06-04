import './main.sass';
import gitBlog from 'github-blog-api';

const myblog = gitBlog({username:'lukego',repo:'blog',author:'lukego'});
myblog.setComment({per_page:3});

// we put `window.blogInfo` object when
// generating the nunjucks templates

const initDisqus = ()=>{
    let disqus_config = function () {
      this.page.url = location.href;
      this.page.identifier = location.href;
    };
    (function() {
    var d = document, s = d.createElement('script');
    s.src = `https://${window.blogInfo.disqus_id}.disqus.com/embed.js`;
    s.setAttribute('data-timestamp', +new Date());
    (d.head || d.body).appendChild(s);
    })();
}

const initFirebase = ()=>{
  let config = {
    apiKey: "AIzaSyAZSJ1d1Sr9MnTK-__3D8SrwXjjQf6EML4",
    authDomain: "myblog-2b0ba.firebaseapp.com",
    databaseURL: "https://myblog-2b0ba.firebaseio.com",
    projectId: "myblog-2b0ba",
    storageBucket: "myblog-2b0ba.appspot.com",
    messagingSenderId: "20890326099"
  };
  firebase.initializeApp(config);
}

const signInFlow = ()=>{
  let provider = new firebase.auth.GithubAuthProvider();
  firebase.auth().signInWithPopup(provider).then(function(result) {
    let token = result.credential.accessToken;
          console.log(token);
    let user = result.user;
  }).catch(function(error) {
    // handle this, right now it's just copy paste from docs
    let errorCode = error.code;
    let errorMessage = error.message;
    let email = error.email;
    let credential = error.credential;
  });
}


const generateComment = (comment)=>{
        // return html needed for comments
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
                        return `<div id="disqus_thread"></div>`
                        break;
                default:
                        break;
        }
}

const generatePostListItem = (post)=>{
        // return html needed for post listing
        return ` <h4 class="title is-4"> ${post.title} </h4> `
}

const loadMoreButton = (iterator)=>{
        // return html for loadMoreButton
        return `
          <div class="button is-danger" id="loadmore_button">Load more ${iterator}s</div>
        `
}

const generateLoadMoreButton = (iterator)=>{
        // assign events and loadMoreButton based on iterator type
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

    if(window.blogInfo.firebaseEnabled){
            initFirebase();
            document.getElementById("signin_button").addEventListener("click", signInFlow);
    }
  }
  else if(window.blogInfo.comment_system === "disqus"){
    commentsContainer.innerHTML += generateComment();
    initDisqus();
    document.querySelector('body').innerHTML += `<script id="dsq-count-scr" src="//geekodour.disqus.com/count.js" async></script>`;
  }
  else{
          // do nothing
  }
}

const insertCategoryMatches = ()=>{
  // calls fetchBlogPosts with label as the parameter
  let label = window.blogInfo.label;
  let postsContainer = document.getElementById('category_posts_container');
  myblog.fetchBlogPosts([label]).then(posts=>{
          generateLoadMoreButton("post");
          posts.forEach(post=>{
                  postsContainer.innerHTML += generatePostListItem(post);
          });
  });
}

// run instructions based on pageType
switch(window.blogInfo.pageType){
        case "index":
                break;
        case "post":
                insertComments();
                break;
        case "category":
                insertCategoryMatches();
                break;
        default:
                break;
}
