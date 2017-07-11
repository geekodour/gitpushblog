const bc = window.blogInfo.bc;

const firebaseInit = ()=>{
  let config = bc.firebaseConfig;
  firebase.initializeApp(config);
}

const githubSignIn = ()=>{
  let provider = new firebase.auth.GithubAuthProvider();
  // this `scope` takes private repo permissions
  // need a lower permission than access to private repo.
  // any `scope` that only enables to comment on issues?
  provider.addScope('repo');
  return new Promise((resolve,reject)=>{
    firebase.auth().signInWithPopup(provider)
            .then(function(result) {
              let token = result.credential.accessToken;
              resolve(token);
            })
            .catch(function(error) {
              // handle this, right now it's just copy paste from docs
              let errorCode = error.code;
            });
  });
}

const disqusInit = ()=>{
    let disqus_config = function () {
      this.page.url = location.href;
      this.page.identifier = location.href;
    };
    (function() {
    var d = document, s = d.createElement('script');
    s.src = `https://${bc.comment.disqus_id}.disqus.com/embed.js`;
    s.setAttribute('data-timestamp', +new Date());
    (d.head || d.body).appendChild(s);
    })();
}

export const firebaseService = {
        init: firebaseInit,
        signIn: githubSignIn
}

export const disqusService = {
        init: disqusInit
}
