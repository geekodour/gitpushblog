const bc = require('../blog_config.json');

const firebaseInit = ()=>{
  let config = bc.firebaseConfig;
  firebase.initializeApp(config);
}

const githubSignIn = ()=>{
  let provider = new firebase.auth.GithubAuthProvider();
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
    s.src = `https://${window.blogInfo.disqus_id}.disqus.com/embed.js`;
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
