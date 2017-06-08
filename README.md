# gitpushblog
a static blog generator with node, nunjucks and the github api.
well it's does whatever a static blog generator like jekyll does, much less to be honest.
but it's a new thing to do just for fun.


## NOTE:
**The README is not written properly, I am not able to explain things properly, I'll improve it later**
Also there are a lot of issues, i'll add them when I get time. Also you might see a lot of closed issues that are the same.
just ignore dem closed issues.

## Quick Start
- `fork` this repository
- enable `issues` in the forked repository (in repository settings).
- change the name of the repository if you want.
- `clone` the forked repository.
- run `npm install`.
- run `npm run dev`
After it shows `REVISION 0 GENERATED` open `localhost:3000` in your browser.
check the newly created `dev` directory in the project root, (it's gitignored, so no worries)

# Why, How and What
This blog generator is suitable for personal blogs for people who use github.
Here's the idea,

Github Element | Blog Element
------------ | -------------
Issues | BlogPosts
Issue comments | BlogPosts comments
Issue labels | BlogPosts categories

It is very simple to use, just configure `blog_config.json` to setup your blog.
and there are four simple commands to interact with your blog from the cli,
`npm run generate`
`npm run dev`
`npm run upload`
`npm run deploy`

Here's a example directory structure of a generated blog

```
├── index.html
├── 2.html
├── assets
│   ├── main.css
│   ├── main.js
│   └── prism.js (3rd party library, bundled with webpack)
├── category
│   ├── c++.html
│   └── machine-learning.html
├── posts
│   ├── Accessing-JavaScript-binary-data-in-C++.html
│   └── Ring-buffers-and-moving-averages.html
├── about.html
└── projects.html
```

paraphrasing a github comment related to the use of github issues for blogposts

> **first person:** I don't really like the idea of "exploiting" GitHub issues for blog comments.
> This is obviously not a designed feature of GitHub API and it feels like an abuse of GitHub service.
> **second person:** To me this feels like something GitHub would approve of. GitHub Issues intentionally gives users a lot of freedom so they can use it however they want. Unlike competitors who forced you to do something a certain way.
> This is creative, and if your blog is hosted via GitHub Pages, then using Issues to discuss the content is not far-fetched at all.

# Setup
There are **two ways** to setup this blogging system,

## 1. Use the generator (NOT YET DONE)
Simply installing and running the blog generator cli app is the easiest, it will configure the
`blog_config.json` for and install dependencies and setup git for you.

`npm install -g gitpushblog-generator` and then `gitpushblog-generator repo_name`

then you can simply run the four commands **generate**,**dev**,**upload** and **deploy**

## 2. Forking this repository
- `fork` this repository
- enable `issues` in the forked repository (in repository settings)
- change the name of the repository if you want.
- `clone` the forked repository.
- run `npm install`
- manually configure `blog_config.json`
- run the npm scripts as described in the usage section

# Comments
Comments are important part of a blog. **gitpushblog** has four comment states.
- `disabled` : if `true` comments will be disabled completely
- `isGithub` : if `true` the github comments of the issue will be listed,
one has to visit the `issue` on github to make a comment like [this blogpost](http://donw.io/post/github-comments/)
- `isGithubAuth` : if `true`, a comment box will appear under the post and firebaseAuth for github will
be there to authenticate the user. (there's an issue with the permissions)
- `isDisqus` : if `true` Disqus comments will be added
(recommend not having `isDisqus` and `isGithub` **both** turned to `true`, it will act as disabled anyway if you do so)

# Usage
A simple usecase is just having all posts in the `posts` directory and generating the `index` pages
but a blog is more than that so **gitpushblog** has builtin disqus and github comment along with **offline** support
so that if you don't have access to the *new issue* page on github, you can just write the post in `markdown` and
upload your posts when you have internet connection.
*(technically, it just creates a new issue on your repo with the markdown content)*

So, let's start by configuring `blog_config.json`

### blog_config.json
HELP NEEDED: **firebase api keys public?**. In the repository, I have my firebase app details given in the `blog_config.json`
so that you can just test out the firebase GithubAuth thing.

a sample is given below:
- **username**: repository owner github username
- **author**: issue creator github username
- **repo**: repository name
- **comment object**: it just has the comment states as mentioned above along with some additional info.
- **firebaseConfig**: the firebase config object for webapps(get it on the firebase console)
```json
{
  "username": "lukego",
  "author": "lukego",
  "repo": "blog",
  "posts_per_page": "6",
  "comments_per_page": "3",
  "comment": {
    "disabled": false,
    "isGithub": true,
    "isDisqus": false,
    "isGithubAuth": true,
    "disqus_id": "geekodour"
  },
  "firebaseConfig": {
    "apiKey": "...",
    "authDomain": "...",
    "databaseURL": "...",
    "projectId": "...",
    "storageBucket": "...",
    "messagingSenderId": "..."
  }
}
```

### npm scripts
`npm scripts` are the main workhorses, there are quite a few `npm scripts` for developers but, just four
for someone just wanting to setup and start blogging.
- `npm run generate` : generate the deployable version in `dist` directory. files are minified.
- `npm run dev` : generate a watch mode enabled build in the `dev` directory
with developer options such as sourcemaps etc.
- `npm run upload`: upload the contents of the `content` direcory. see offline section for more details.
- `npm run deploy`: put the contents of the dist folder into `gh-pages` branch, so on the next push, if github
pages is set to `gh-pages` branch, the new content is available on the site. (**deploy is not written yet, will do that soon**)

### Offline
When offline you can write your posts in `markdown` inside the `contents` directory.
and when online you can upload them to github.
> using `npm run dev` will work offline, if it is not able to connect to githubapi
> it will just use the contents of the `content` directory as posts, if it can connect
> to the API both(content directory+github issue data) will be shown.
> but `npm run generate` will **only** fetch information from github api.

Github needs you to have authenticated to create an issue, in other words to create a blog post.
so, can't have the `api token` floating around in the repo. So for offline support i used
`.dotenv` for having the `github personal api token` as an env variable.
just make a `.env` file and put in your github personal api token like this. *(the `.env` file is gitignored)*
```
GITHUB_AUTH_TOKEN=6565THIS_IS_MY_TOKEN65565
```
now running `npm run upload` will upload the posts inside `content` directory, after successful upload it will clear up
the `content` directory.

# Todo
- [ ] Make the `main.sass` file cleaner and organized
- Will add more todo soon.. there's a lot of them.

# Contribute
- It will be awesome if anyone can help in creating some themes, it's almost just plain HTML and CSS
- will add issues and more contributing info soon.

# Eating my own dogfood
created this github api wrapper called [github-blog-api](https://github.com/geekodour/github-blog-api) to help with the github api calls
