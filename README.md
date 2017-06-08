# gitpushblog
a static blog generator with node, nunjucks and the github api

## NOTE:
**The README is not written properly, I am not able to explain things properly, I'll improve it later**

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

# Setup
There are **two ways** to setup this blogging system,

## Use the generator (NOT YET DONE)
Simply installing and running the blog generator cli app is the easiest, it will configure the
`blog_config.json` for and install dependencies and setup git for you.

`npm install -g gitpushblog-generator` and then `gitpushblog-generator repo_name`

then you can simply run the four commands **generate**,**dev**,**upload** and **deploy**

## Forking this repository
- `fork` this repository
- enable `issues` in the forked repository (in repository settings)
- change the name of the repository if you want.
- `clone` the forked repository.

After that you'll need to configure the `blog_config.json` file in the root directory of the project.
then you can run the

# Usage
A simple usecase is just having all posts in the `posts` directory and generating the `index` pages
but a blog is more than that so **gitpushblog** has builtin disqus and github comment along with **offline** support
so that if you don't have access to the *new issue* page on github, you can just write the post in `markdown` and
upload your posts when you have internet connection
*(technically, it just creates a new issue on your repo with the markdown content)*

So, let's start by configuring `blog_config.json`

### blog_config.json
HELP NEEDED: ** firebase api
```
{
  "username": "lukego", // repository owner name
  "author": "lukego", // issue creator name
  "repo": "blog", // repo name
  "posts_per_page": "6",
  "comments_per_page": "3",
  "comment": {
    "disabled": false, // disable comments completely
    "isGithub": true, // github comments, just the fetched comments, you're not able to comment
    "isDisqus": false, 
    "isGithubAuth": true,
    "disqus_id": "geekodour"
  },
  "firebaseConfig": {
    "apiKey": "AIzaSyAZSJ1d1Sr9MnTK-__3D8SrwXjjQf6EML4",
    "authDomain": "myblog-2b0ba.firebaseapp.com",
    "databaseURL": "https://myblog-2b0ba.firebaseio.com",
    "projectId": "myblog-2b0ba",
    "storageBucket": "myblog-2b0ba.appspot.com",
    "messagingSenderId": "20890326099"
  }
}
```

### npm scripts


### Offline

# Contribute
- It will be awesome if anyone can help in creating some themes, it's almost just plain HTML and CSS

# Eating my own dogfood
I created this github api wrapper to help with the github api calls
