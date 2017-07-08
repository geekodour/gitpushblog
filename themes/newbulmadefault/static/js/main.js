import { initCommentSystem, updateCategoryList, displaySignOut  } from './utils';
import { firebaseService } from './services';
import '../css/main.sass';

// init highlight.js (used cdn)
hljs.initHighlightingOnLoad();
// init firebase and display signout if signedin
firebaseService.init();
displaySignOut();

// run instructions based on pagetype
// widow.blogInfo is passed to each page
// when generating the template with nunjucks

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
