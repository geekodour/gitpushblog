/*
 * JavaScript for gitpushblog, webpack + init stuff
 */

import { initCommentSystem, initPostCategoryPage, displaySignOut  } from './utils';
import { firebaseService } from './services';

// only imported assets will be available inside assets directory

import '../css/main.scss';
import '../images/favicon.png';

// end of file imports

const blogInfo = window.blogInfo;
const bc = blogInfo.bc;

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
                // you can enable async loading of category posts by toggling template_cat_posts
                // by default this is false
                if(!bc.others.template_cat_posts){
                  initPostCategoryPage();
                }
                break;
        default:
                break;
}


/*
 * Add your custom javascript below
 */

console.log('wow!');
