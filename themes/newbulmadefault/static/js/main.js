import { initCommentSystem, updateCategoryList } from './utils';
import '../css/main.sass';

// init highlight.js (used cdn)
hljs.initHighlightingOnLoad();


// run instructions based on pagetype
// widow.blogInfo is passed to each page
// when generating the template
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
