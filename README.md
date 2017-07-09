# NOTE: MAJOR CHANGE, userpages things is changing.. updates soon

# gitpushblog
- A static blog generator.
- A set of npm scripts that make it easy to build a blog using the **githubAPI** and **nunjucks**.

It is sort of like [Jekyll](https://jekyllrb.com/), but currently does limited stuff.

see a [live demo here](https://geekodour.github.io/) else get started with the [quickstart guide](#quick-start)


## Table of contents
- [Features and Limitations](#features)
- [Basic idea](#basic-idea)
- [Quick start guide](#quick-start)

## Features
- Uses npm scripts
- Built with webpack and sass support
- Blogpages, postpages, simple pages
- Offline markdown draft support, live editing(needs reload)
- Works hasslefree with github repository pages and profilepages.
- Easily add,remove and edit themes. **(Need help creating themes if possible)**
- Edit posts from mobile easily
- Uses github api
- Can make a post using github or using the commandline.

## Limitations
- Probably does not work on Windows as of now.
- Uses only nunjucks for now, let me know if to add support of any other templating engine.
- I am thinking to add gatsby(react) support.
- Currently only works with github pages (want to keep it that way)
- See issues for others.

## Basic idea

Here's the idea,

Github Element | Blog Element
------------ | -------------
Issues | BlogPosts
Issue comments | BlogPosts comments
Issue labels | BlogPosts categories

There was not much of a need, but I guess it's fun, also I wanted to use something like
Jekyll but not Jekyll.

**gitpushblog** is suitable for personal blogs for people who use github regularly.
The workfolw is simple, points **1 to 4** are one time unless you want to push your `drafts/`
online or push theme changes to the repository. Otherwise, to interact with the blog you'll only
need to run **5 to 7**.

1. You clone/fork this repository and set the git remotes ( see installation )
2. Then configure `_config.yml` according to your needs
3. Add,remove or change theme according to your needs
4. `git push` the whole repository, `dev/` and `dist/` are gitignored. (optional but recommend)

5. create offline draft posts or posts using github issues on the browser (see [usage]() for details)
6. use `npm run dev` to do theme development or see live changes while editing offline drafts.
7. run `npm run push` to publish your blog.

Please see [installation]() and [usage]() for more details.

Note: `dev/` and `dist/` are gitignored.

Paraphrasing a [HN comment](https://news.ycombinator.com/item?id=14170041) related to the use of github issues for blogposts

> **person1:** I don't really like the idea of "exploiting" GitHub issues for blog comments.
> This is obviously not a designed feature of GitHub API and it feels like an abuse of GitHub service.

> **person2:** To me this feels like something GitHub would approve of. GitHub Issues intentionally gives users a lot of freedom so they can use it however they want. Unlike competitors who forced you to do something a certain way.
> This is creative, and if your blog is hosted via GitHub Pages, then using Issues to discuss the content is not far-fetched at all.

so I think this is a valid idea.

The GithubAPI is not directory accessed, instead it uses a [github-blog-api](https://www.npmjs.com/package/github-blog-api)
, using that npm package you can make a fully client side blog if you want to, but here we're using it to generate
the static content.


## Quick Start
**1. Clone gitpushblog repository locally**
```
$ git clone https://github.com/geekodour/gitpushblog.git
```
**2. Create a new github repository, name it whatever you like. we'll call it `<new_repo_name>`**
**3. Point the cloned `gitpushblog` to `<new_repo_name>`**
```
$ mv gitpushblog <new_repo_name>
$ cd <new_repo_name>
$ git remote remove origin
$ git remote add origin https://github.com/<username>/<new_repo_name>.git
```
**4. Open `_config.yml` and change the following:**
```
.
.
    userpage: false
    baseurl: /<new_repo_name>

username: <username>
author: <username>
repo: <new_repo_name>
.
.
```
**5. Create few blogposts**

*offline draft post*
```
$ npm run new hello_world_draft.md
```
*github issue post*

go to `https://github.com/<username>/<new_repo_name>` and create a new issue. Remember, issues are our blogposts.
give it a title of **"I am a title from github issues"**
give it a comment body of of
```
## heading
I am some text inside heading
```
then submit the issue. Now we've created two very basic blogposts,
one in the offline `/drafts` directory another directly in Github.
let's see gitpushblog in action now.

**6. Inside `<new_repo_name>/`, run `npm install`**

**7. After installation is complete, run `npm run dev`**

**8. Visit `localhost:3000` in your browser**
You'll now see a development build of the blog,
if you make changes in your draft or theme and reload, the changes will reflect immediately.

**9. Now it's time to push our blog to Github**
```
$ npm run push
```
git will ask for credentials before the push if using HTTPS, give it.
the push will be done to the `gh-pages` branch of the repository, it will create one if does not already exist.

**10. Visit `https://<username>.github.io/<new_repo_name>/`**

You'll notice that the posts inside `/drafts` are not there, whereas they were showing locally.
You'll need to `npm run upload` to upload drafts to github, which is discussed later in this readme.

That's all for the QuickStart.


## Installation and Explanation of QuickStart
**I highly recommend you do the [QuickStart](#quick-start) if you haven't already**

There are two ways you can get started with:
- fork
- clone

I recommended **cloning**, because you won't have that `forked from` thing under the repository name. If you don't mind having that, then please follow the fork installation instructions :smile:

Because github offers [userpages and repopages](https://help.github.com/articles/user-organization-and-project-pages/),
`userpages` as basically profile pages, eg. [geekodour.github.io](https://geekodour.github.io/).
`repopages` are repository pages, eg. [geekodour.github.io/gitpushblog](https://geekodour.github.io/gitpushblog).
Github only allows the `master` branch to be the publishing branch so, please see configuration for using gitpushblog
with **userpages**.

**Options for setting up the blog**
1. Use `userpage` as the blog, eg. [geekodour.github.io](https://geekodour.github.io/).
2. Use `repopage` as the blog, eg. [geekodour.github.io/gitpushblog](https://geekodour.github.io/gitpushblog).

### Installing gitpushblog (by cloning)
1. Clone gitpushblog repository locally
```
$ git clone https://github.com/geekodour/gitpushblog.git
```
2. Create a Github repository named `<new_repo_name>`, I recommend naming it **'blog'**, in our case `<new_repo_name>` will be **'blog'**.
Now, If you are planning to make this blog your userpage/profilepage then head over to GitHub and create a new repository named `username.github.io`, where `username` is your GitHub username.
If the first part of the repository doesn’t exactly match your username, it won’t work, so make sure to get it right.
If you already have a `username.github.io` repository, then I suggest you keep a backup of it before proceeding.
So, if you'll have two new repositories now, one `<new_repo_name>` and another `username.github.io`.

3. Point the cloned `gitpushblog` to `<new_repo_name>`
```
$ mv gitpushblog <new_repo_name>
$ cd <new_repo_name>
$ git remote remove origin
$ git remote add origin https://github.com/<username>/<new_repo_name>.git
```

4. open `_config.yml` and change the following:
```
.
.
    userpage: false
    baseurl: /<new_repo_name>

username: <username>
author: <username>
repo: <new_repo_name>
.
.
```
**NOTE:** If you're planning to use userpages/profilepages for the blog, then set these `userpage` to `true` and `baseurl` to `""`

That's all for the install.

See [usage]() for usage instructions.


### Installing gitpushblog (by forking)
1. Fork this repository
2. In the forked version, go to settings and **enable** `issues`
3. You can also change the repository name to something like **'blog'** if you want to.
4. Now clone the forked repository, and `cd` inside it and run `npm install`
5. open `_config.yml` and change the following and save.
```
.
.
    userpage: false
    baseurl: /<new_repo_name>

username: <username>
author: <username>
repo: <new_repo_name>
.
.
```
**NOTE:** If you're planning to use userpages/profilepages for the blog, then set these `userpage` to `true` and `baseurl` to `""`

That's all for the install.

See usage for usage instructions.

## Usage
gitpushblog uses **npm scripts**.

### Basic Usage
After the installation,
- **Running in development**
`npm run dev` is a very handy command that helps you see your

- **Writing a new post**
  - You can write a new post by creating a issue in <new_repo_name> repository, give it the labels you want they will all show up.
  - If you prefer offline writing then you can do

- **Editing a post**

- **Uploading a offline draft**

- **Pushing blog changes**

- **Pushing repository changes**


### More on Usage

- **`npm run dev`** : Generate the development build of the blog in watch mode and serve in port 3000,
useful if you are writing a draft and want to see changes in the browser on reload, also helpful when
developing the theme. The generated files are in `/dev`, `/dev` is gitignored.

- **`npm run new <draft_name.md>`** : Create a new markdown file inside `/drafts` with appropriate template to start editing.

- **`npm run upload`** : Lets you choose which **draft files** to upload to github issues,
and then uploads them. If upload was successful the uploaded file will be **deleted** from `/drafts`.
Useful when you're done writing a draft offline and ready to publish it online.

**IMPORTANT: You'll need to have your github `personal access token` set to the `GITHUB_AUTH_TOKEN` env. variable
for `npm run upload` to work. Read: `Setting GITHUB_AUTH_TOKEN`**

- **`npm run generate`** : Generates the production build to say, minifies static assets etc. The files are in `/dist`
- **`npm run push`** : It runs `npm run generate` first and then pushes the `/dist` directory to the `gh-pages` branch.
- **`npm run push:only`** : Only pushes the `/dist` directory to `gh-pages` branch.

## Configuration and `_config.yml`
All configurations are done in _confg.yml

### `_config.yml` explanations

- `meta.blog_name` : Name of the blog, can be used in places like navbar by the theme
- `meta.blog_theme` : Name of the directory inside `/themes` to use as the theme
- `meta.engine` : This should be `nunjucks` as that's the only templating engine that's supported as of now.
- `meta.userpage` : should be set to true if blog is a `userpage`
- `meta.baseurl` : `/<repo_name>`, it is required for repopages, for user pages it's just `/`, read [more about baseurl](https://byparker.com/blog/2014/clearing-up-confusion-around-baseurl/)

- `username` : github username
- `author` : github username basically. explanation: github-blog-api filters issues based on author, so if someone else creates an issue, only the ones you created will show up.
- `repo` : name of the repository, where you want gitpushblog to be.
- `posts_per_page` : number of posts to fetch at once (max 100), used by static generator and javascript in the theme
- `comments_per_page` : number of comments to fetch at once (max 100), used by static generator and javascript in the theme

- `comments.disabled` : if `true` no comments will show up, no one can comment.
- `comments.isGithub` : if `true` github comments will be shown.
- `comments.isGithubAuth` : if `true` a will show a comment box, where you can comment by authenticating with your github account.

**NOTE: This is super experimental and I think is **dangerous** too, please check the issue regarding this
if you'd like to help, I recommend you set it to `false` for now**
- `comments.isDisqus` : if `true` will let the theme declare `divs` and containers for the disqus commenting system,
disqus is already integrated in default theme, so just set this to `true` and `isGithub` to `false` if you want disqus comments.
- `comments.disqus_id` : your disqus id

- `firebaseConfig.*` : these firebase configuration options that you get from firebase, again this is highly experimental, recomment not using it for now.
If you want to experiment, then read [setting up githubAuth and commenting with firebase]()

### Setting up githubAuth and commenting with firebase
Follow [this guide](https://firebase.google.com/docs/web/setup) from firebase to get the credentials and put the ones needed in `_config.yml`

### GITHUB_AUTH_TOKEN Env Variable for `npm run upload`
1. To get the `personal access token` go to [https://github.com/settings/tokens](https://github.com/settings/tokens)
give it the whole `repo` scope permission and give a name to your token and you'll have a newly generated token.
2. Copy that token
3. Create a file named `.env` inside the blog repository, put the token inside the `.env` file like this:
```
GITHUB_AUTH_TOKEN=YOUR_TOKEN_HERE_NO_SPACES
```
4. you're done, `.env` file is gitignored, so it will remain local to your system always.

# Templates and Theme details
The templates are created using [nunjucks](https://mozilla.github.io/nunjucks/). The directory structure
of a theme looks somethng like this:
```
.
├── category_page.html
├── index.html
├── pages
│   ├── about.html
│   └── projects.html
├── post_page.html
├── snippets
│   ├── aboutbox.html
│   ├── base.html
│   ├── footer.html
│   ├── labelsBox.html
│   └── navbar.html
└── static
    ├── css
    │   └── main.sass
    └── js
        ├── main.js
        ├── services.js
        └── utils.js
```
On running `npm run dev` or `npm run generate`, the output of these templates look something like this:
```
.
├── index.html
├── 2.html
├── 3.html
│
├── assets
│   ├── main.css
│   └── main.js
│
├── category
│   ├── hacking.html
│   └── tech.html
│
├── posts
│   ├── Code-reading:-LuaJIT.html
│   └── Why-Snabb.html
│
├── about.html
└── projects.html
```
you can read the themes, currently there are two themes **gitpushblogdefault** and **minimal**, they can be found in the `/themes` directory.

# Todo
- [ ] will add soon

# Contribute
- PRs and everything else is welcome
- It will be awesome if anyone can help in creating some themes, you can create themes using [nunjucks](https://mozilla.github.io/nunjucks/)
for now.

# Contributors
- [@CodeDotJS](https://github.com/CodeDotJS)
