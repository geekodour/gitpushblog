# NOTE: MAJOR CHANGE, userpages things is changing.. updates soon

# gitpushblog
- A static blog generator.
- A set of npm scripts that make it easy to build a blog using the **githubAPI** and **nunjucks**.

It is sort of like [Jekyll](https://jekyllrb.com/), but currently does limited stuff.

see a [live demo here](https://geekodour.github.io/) else get started with the [quickStart guide](#quick-start)


## Table of contents
- Features and Limitations
- Basic idea behind
- Quick start guide

## Features
- uses npm scripts
- built with webpack and sass support
- works hasslefree with githubpages(both userpages and repo pages)
- easily add remove themes and edit themes. (need help creating themes if possible)
- mobile support lol
- uses github api
- offline markdown draft support, live editing*

## Limitations
- Probably does not work on windows
- Uses only nunjucks for now, let me know if to add support of any other
- I am thinking to add gatsby(react) support
- see issues for others
- currently only works with github pages (want to keep it that way)

## Basic idea behind

There was not much of a need, but I guess it's fun, also I wanted to use something like
Jekyll but not Jekyll.

**gitpushblog** is suitable for personal blogs for people who use github regularly.
Here's the idea,

Github Element | Blog Element
------------ | -------------
Issues | BlogPosts
Issue comments | BlogPosts comments
Issue labels | BlogPosts categories

Paraphrasing a [HN comment](https://news.ycombinator.com/item?id=14170041) related to the use of github issues for blogposts

> **person1:** I don't really like the idea of "exploiting" GitHub issues for blog comments.
> This is obviously not a designed feature of GitHub API and it feels like an abuse of GitHub service.

> **person2:** To me this feels like something GitHub would approve of. GitHub Issues intentionally gives users a lot of freedom so they can use it however they want. Unlike competitors who forced you to do something a certain way.
> This is creative, and if your blog is hosted via GitHub Pages, then using Issues to discuss the content is not far-fetched at all.

so I think this is a valid idea.

The GithubAPI is not directory accessed, instead it uses a [github-blog-api](https://www.npmjs.com/package/github-blog-api)
, using that npm package you can make a fully client side blog if you want to, but here we're using it to generate
the static content.

`dev/` and `dist/` are gitignored, so if you `git push orign master`, you won't see them. But `npm run push` ...

## Quick Start
1. Clone gitpushblog repository locally
```
$ git clone https://github.com/geekodour/gitpushblog.git
```
2. Create a new github repository, name it whatever you like. we'll call it `<new_repo_name>`
3. Point the cloned `gitpushblog` to `<new_repo_name>`
```
$ mv gitpushblog <new_repo_name>
$ cd <new_repo_name>
$ git remote remove origin
$ git remote add origin https://github.com/<username>/<new_repo_name>.git
```
4. open `_config.yml` and change the following(mind the slash!),
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
5. create few blogposts,

**offline draft post**
```
$ npm run new hello_world_draft.md
```
**github issue post**

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

6. Inside `<new_repo_name>/`, run `npm install`

7. After installation is complete, run `npm run dev`

8. Visit `localhost:3000` in your browser, you'll now see a development build of the blog,
if you make changes in your draft or theme and reload, the changes will reflect immediately.

9. Now it's time to push our blog to Github
```
$ npm run push
```
git will ask for credentials before the push if using HTTPS, give it.
the push will be done to the `gh-pages` branch of the repository, it will create one if does not already exist.

10. visit `https://<username>.github.io/<new_repo_name>/`

You'll notice that the posts inside `/drafts` are not there, whereas they were showing locally.
You'll need to `npm run upload` to upload drafts to github, which is discussed later in this readme.

That's all for the QuickStart.


### A note about github, git and gitpushblog

The nice thing is, you can use `git push origin master` to push changes to the `master` branch and run `npm run push` to push generated blog contents to the `gh-pages` branch.

This is a little bit different if you use `userpages` for the blog because github
[only allows the `master` branch to be the publishing branch.](https://help.github.com/articles/configuring-a-publishing-source-for-github-pages/)
So, when using `userpages` with gitpushblog `npm run push` pushes generated blog contents to `master` branch and you are supposed to push changes to `dev` branch. (you can name `dev` branch anything you want ofcourse)

## Installation and Explanation of QuickStart
**I highly recommend you do the [QuickStart]() if you haven't already**

There are two ways you can get started with:
- fork
- clone

I recommended **cloning**, because you won't have that `forked from` thing. If you don't mind having that, then please follow the fork installation instructions :smile:

Because github offers [userpages and repopages](https://help.github.com/articles/user-organization-and-project-pages/),
I've added support for both, `userpages` as basically profile pages, eg. [geekodour.github.io](https://geekodour.github.io/).
It's simple as changing `userpage` to `true` in `_config.yml`, read more about [configuration and `_config.yml`]().

**Options for setting up the blog**
1. use `userpage` as the blog (1 repository)
2. use `userpage` as the intro page, use a `repopage` as the blog (I use this, this way the userpage does not need have gitpushblog
and it's just a simple html file, but you endup using 2 different repositories)
3. use `repopage` as the blog (1 repository)

### Installing gitpushblog (by cloning)
1. Clone gitpushblog repository locally
```
$ git clone https://github.com/geekodour/gitpushblog.git
```
> After cloning, you'll decide which option to choose, if you choose option 2 or 3, then continue. else
> if you're planning to use `userpages` as the blog *(1st option)* then [use these instructions instead]() after cloning.

2. Create a Github repository for the blog in Github, I recommend naming it **'blog'**, in our case `<new_repo_name>` will be **'blog'**

3. Point the cloned `gitpushblog` to `<new_repo_name>`
```
$ mv gitpushblog <new_repo_name>
$ cd <new_repo_name>
$ git remote remove origin
$ git remote add origin https://github.com/<username>/<new_repo_name>.git
```

4. open `_config.yml` and change the following(mind the slash!),
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
5. Done.

see usage for usage instructions.


### Installing gitpushblog (by cloning) + userpage as the blog
When using
TODO


### Installing gitpushblog (by forking)
The fork instructions are very similar to the clone instructions.
1. Fork this repository
2. In the forked version of gitpushblog, go to settings and enable `issues`
3. You can also change the repository name to something like 'blog' if you want to.
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
6. Done.

see usage for usage instructions.


## Usage
gitpushblog uses **npm scripts**.

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
