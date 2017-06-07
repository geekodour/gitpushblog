const firebaseInit = ()=>{
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

const githubSignIn = ()=>{
  let provider = new firebase.auth.GithubAuthProvider();
  provider.addScope('repo');
  firebase.auth().signInWithPopup(provider)
          .then(function(result) {
            let token = result.credential.accessToken;
            console.log(token);
          })
          .catch(function(error) {
          // handle this, right now it's just copy paste from docs
            let errorCode = error.code;
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
