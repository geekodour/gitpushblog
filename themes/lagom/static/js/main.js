// gitpushblog javascript

import { initCommentSystem, initPostCategoryPage, displaySignOut  } from './utils';
import { firebaseService } from './services';

// css and other file imports
import '../css/all.css';
import '../images/favicon.png';
import '../images/logo.png';
// end of file imports

const blogInfo = window.blogInfo;
const bc = blogInfo.bc;

// init highlight.js (used cdn)
hljs.initHighlightingOnLoad();

// init firebase and display signout if signedin
if(bc.comment.isGithubAuth){
  firebaseService.init();
  displaySignOut();
}

switch(blogInfo.pageType){
        case "index":
                break;
        case "post":
                initCommentSystem();
                break;
        case "category":
                if(!bc.others.template_cat_posts){
                  initPostCategoryPage();
                }
                break;
        default:
                break;
}

// end of gitpushblog javascript
