# gitpushblog
- A static blog generator.
- A set of npm scripts that make it easy to build a blog using the **githubAPI** and **nunjucks**.

It is sort of like [Jekyll](https://jekyllrb.com/), but currently does very limited stuff and is in its early stage.

see a [live demo here](https://geekodour.github.io/) else get started with the [quickstart guide](#quick-start)
more examples:
1. https://geekodour.github.io/gitpushblog
2. https://geekodour.github.io/gitpushblog
3. https://geekodour.github.io/gitpushblog


## Table of contents
- [Features](#features)
- [Basic idea](#basic-idea)
- [Quick start guide](#quick-start)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Templates and Theme Details](#templates-and-theme-details)
- [Todo](#todo)
- [Contribute](#contribute)
- [Limitations](#limitations)
- [Contributors](#contributors)

## Features
- Uses npm scripts
- Built with webpack and preprocessor support
- easily create themes
- Github and Disqus Comments
- IndexPages,pagination, postpages, simple pages
- Offline markdown draft support, live editing(needs reload)
- Works hasslefree with github repository pages and profile pages.
- Easily add,remove and edit themes. **(Need help creating themes if possible)**
- Edit posts from mobile easily using any github client or browser
- Make a post using Github or using the commandline.

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

1. You clone/fork this repository and set the git correct remotes
2. Then configure `_config.yml` according to your needs
3. Add,remove or change theme according to your needs
4. `git push` the whole repository if you want to
5. Create offline draft **posts using cli** or using github **issues on the browser**
6. use `npm run dev` to do theme development or see live changes while editing offline drafts.
7. run `npm run push` to publish your blog.

Please see [installation](#installation) and [usage](#usage) for more details.

Note: `dev/` is gitignored.

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
**2. Create a new github repository, name it whatever you like. we'll call it `<repo_name>`**

**3. Point the cloned `gitpushblog` remotes to `<repo_name>`**
```
$ mv gitpushblog <repo_name>
$ cd <repo_name>
$ git remote remove origin
$ git remote add origin https://github.com/<username>/<repo_name>.git
```
**4. Open `_config.yml` and change the following:**
```
.
.
    userpage: false
    baseurl: "/<repo_name>"

username: <username>
author: <username>
repo: <repo_name>
.
.
```
You might need to configure _config.yml according to theme needs but this will work for the default theme.

**5. Inside `<repo_name>/`, run `npm install`**, this will take a while

**6. Create few blogposts**

*offline draft post*
```
$ npm run new hello_world_draft.md
```
*github issue post*

go to `https://github.com/<username>/<repo_name>` and create a new issue. Remember, issues are our blogposts.
give it a title of **"I am a title from github issues"**
give it a comment body of of
```
## heading
I am some text inside heading
```
then submit the issue. Now we've created two very basic blogposts,
one in the offline `/drafts` directory another directly in Github.
let's see gitpushblog in action now.

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

Additionally, You can also push the working repository to Github using **git add,commit and push origin master** if you want to.
(use `git push --force origin master` if `git push origin master` fails)

**10. Make gh-pages branch the publishing branch**

Head over to the settings page of your `<repo_name>` repository in Github, in the **Github Pages** section,
choose **gh-pages branch** as the source and save.

**11. Visit `https://<username>.github.io/<repo_name>/`** , it might take a few seconds to show up the first time.

You'll notice that the posts inside `/drafts` are not there, whereas they were showing locally.
You'll need to `npm run upload` to upload drafts to github, which is discussed later in [usage](#usage).

That's all for the QuickStart.


## Installation
**I highly recommend you do the [QuickStart](#quick-start) if you haven't already**

There are two ways you can get started with:
- fork
- clone

I recommended **cloning**, because you won't have that `forked from` thing under the repository name. If you don't mind having that, then please follow the fork installation instructions :smile:

Github offers [userpages and repopages](https://help.github.com/articles/user-organization-and-project-pages/).

`userpages` are basically profile pages, eg. [geekodour.github.io](https://geekodour.github.io/).

`repopages` are repository pages, eg. [geekodour.github.io/gitpushblog](https://geekodour.github.io/gitpushblog).

When using [`userpages`, Github only allows the `master` branch to be the publishing branch](https://help.github.com/articles/configuring-a-publishing-source-for-github-pages/)
so, [see configuration](#configuration) for using gitpushblog with **userpages**. The installation instructions also have important information on setting up `userpage/profilepage`

**Options for setting up the blog**
1. Use `userpage` as the blog, eg. [geekodour.github.io](https://geekodour.github.io/).
2. Use `repopage` as the blog, eg. [geekodour.github.io/gitpushblog](https://geekodour.github.io/gitpushblog).

### Installing gitpushblog (by cloning)
1. Clone gitpushblog repository locally
```
$ git clone https://github.com/geekodour/gitpushblog.git
```
2. Create a Github repository named `<repo_name>`, I recommend naming it **'blog'**, in our case `<repo_name>` will be **'blog'**.

Now, If you are planning to make this blog your **userpage/profilepage** then head over to GitHub and create a new repository named **`username.github.io`**, where `username` is your GitHub username. If the first part of the repository doesn’t exactly match your username, it won’t work, so make sure to get it right.
If you already have a `username.github.io` repository, then I suggest you keep a backup of it before proceeding.
So, you'll have two new repositories now, one `<repo_name>` and another `username.github.io`.

3. Point the cloned `gitpushblog` to `<repo_name>`
```
$ mv gitpushblog <repo_name>
$ cd <repo_name>
$ git remote remove origin
$ git remote add origin https://github.com/<username>/<repo_name>.git
```
4. open `_config.yml` and change according to your needs, read [configuration](#configuration) to know how to modify `_config.yml`

5. inside `<repo_name>`, run `npm install`

That's all for the install.

See [usage](#usage) for usage instructions.


### Installing gitpushblog (by forking)
1. Fork this repository
2. In the forked version, go to settings and **enable** `issues`
3. You can also change the repository name to something like **'blog'** if you want to.
4. Now clone the forked repository, and `cd` inside it and run `npm install`
5. open `_config.yml` and change according to your needs, read [configuration](#configuration) to know how to modify `_config.yml`
6. inside `<repo_name>`, run `npm install`

That's all for the install.

See [usage](#usage) for usage instructions.

## Usage
gitpushblog uses **npm scripts**.

### Basic Usage
After the installation,
- **Running in development**

`npm run dev` is a very handy command that runs a development version of the blog in watch mode on port 3000.
It can be useful when writing an offline draft or editing the theme.

- **Writing a new post**
  - You can write a new post by creating a github issue in `<repo_name>` repository, give it the labels you want they will all show up.
  - If you prefer offline writing then you can do `npm run new <filename.md>`, and a new file will be created inside the `/drafts`
    directory with appropriate template which you can start editing. **Bonus**, if you're using `npm run dev` while editing and adding
    new offline posts, you see the changes on browser reload.

- **Editing a post**

You need to edit the post/issue in github

- **Uploading a offline draft**

`npm run upload` lets you choose which **files** from `/drafts` to upload to github issues,
and then uploads them. If upload was successful the uploaded file will be **deleted** from `/drafts`.
Use it when you're done writing a draft offline and ready to publish it online.

Usually you **don't** have to do `git add -A` then `git commit -m 'message'` and `git push orign master` but
if you want to push the draft changes to the repository *(not the publishing branch/repo)*, then you can do `git push origin master`,
when you're ready to publish the draft just do `npm run upload` and it will create a githubissue with the drafts'
content.

Don't forget to do `npm run push` to push the changes to the actual blog.

**IMPORTANT: You'll need to have your github `personal access token` set to the `GITHUB_AUTH_TOKEN` env. variable
for `npm run upload` to work. Read: [`Setting GITHUB_AUTH_TOKEN`](#setting-up-github_auth_token-env)**

- **Pushing blog changes**

`npm run push` is the command. **It pushes the contents of the `/dist` dist directory to the appropriate repository:branch**
It also runs the `npm run generate` command which creates the `/dist` directory in the first place.

Pushing happens differently for userpages and repository pages.(gitpushblog manages all these, you don't have to worry)

In **repopages** the blog root is in the `gh-pages` branch of the same repository.

In **userpages** the blog root is in the `master` branch of the `username.github.io` repository.

So you have a `<repo_name>` repository, where all your have `themes/`, `scripts/`, `dist/` etc.
But when you push the changes with `npm run push` the content of the public blog go in another **repository or branch**
depending upon what you configure in `_config.yml` with `userpages`.

- **Pushing repository changes**

Repository changes include, changes to anything other than the contents of `/dev` and `/drafts`.
changes in theme,scripts etc.
`npm run dev`, `npm run generate`, `npm run push` these commands will always use the local configuration and files,
so if you made a change in the local you'll see the changes reflected in the blog when using these commands.

`npm run push` will only push the contents of `/dist` so you'll have the changes in the blog too as `/dist` will be generated
using local configurations only.

But the repository on github which `git remote origin` points to, in our case does not know about these repository changes.
If you want to push these changes then do the `origin` then do,
(**you'll probably have to use `git push --force origin master`
if you're pushing for the first time after changing the remote origin in installation**)
```
$ git add -A
$ git commit -m 'commit message'
$ git push origin master
```
`/dev` is gitignored but are forced added by `npm run push` because it's necessary then. recommendation is to keep it
that way.

**Note:** You can also push repository changes if you want to keep an online copy of your draft but don't want to publish it to the blog yet.


### More on Usage

- **`npm run dev`** : Generate the development build of the blog in watch mode and serve on port 3000,
useful if you are writing a draft and want to see changes in the browser on reload, also helpful when
developing the theme. Watchmode keeps track of `add`,`change` and `unlink` of files.

- **`npm run new <draft_name.md>`** : Create a new markdown file inside `/drafts` with appropriate template to start editing.

- **`npm run upload`** : Lets you choose which **draft files** to upload to github issues,
and then uploads them. If upload was successful the uploaded file will be **deleted** from `/drafts`.
Useful when you're done writing a draft offline and ready to publish it online.

**IMPORTANT: You'll need to have your github `personal access token` set to the `GITHUB_AUTH_TOKEN` env. variable
for `npm run upload` to work. Read: [`Setting GITHUB_AUTH_TOKEN`](#setting-github_auth_token)**

- **`npm run generate`** : Generates the production build to say, minifies static assets etc. The files are in `/dist`
- **`npm run push`** : It runs `npm run generate` first and then pushes the `/dist` directory to the `gh-pages` branch.
- **`npm run push:only`** : Only pushes the `/dist` directory to `gh-pages` branch if using userpages then to the `master` branch of `username.github.io` repository.

## Configuration
All configurations are done in `/_confg.yml`

### Userpages and repo pages
`npm run push` will push contents of `/dist` to **master** branch of **username.github.io** repository if `meta.username` is `true`.
The `baseurl` should be a empty string when using userpages.

Otherwise it will push contents of `/dist` to the `gh-pages` branch of the repository the `origin` is pointing to, which we set during
installation, when using `repopages` there is the problem of `baseurl` so you need to set it to `/<repo_name>`

So, if you're planning to use **userpages** for the blog, then set `meta.userpage` to `true` and `meta.baseurl` to `""`,
please also see the 2nd point in [installing by cloning](https://github.com/geekodour/gitpushblog#installing-gitpushblog-by-cloning)
if you are planning to use it for **userpage**

### Themes
Themes are located in `/themes`, currently all the available themes are included in there.
`meta.blog_theme` is the name of directory which includes the theme files inside `/themes`

If you want to get started with building themes, then read the [building theme docs]() and
Themes are managed by git subtree command(see theme docs). It takes less than
15mins to turn a Jekyell theme into a theme that gitpushblog supports.

### Comments
There is `comment` field in `_config.yml`, the theme uses these values in comments to insert,remove comments, include github comments
or disqus comments. The settings are pretty self explanatory.

### `_config.yml` explanations

- `meta.blog_name` : Name of the blog, can be used in places like navbar by the theme
- `meta.blog_theme` : Name of the directory inside `/themes` to use as the theme
- `meta.engine` : This should be `nunjucks` as that's the only templating engine that's supported as of now.
- `meta.userpage` : should be set to true if blog is a `userpage`
- `meta.baseurl` : `"/<repo_name>"`, it is required for `repopages`, for `userpages` set it to `""`, read [more about baseurl](https://byparker.com/blog/2014/clearing-up-confusion-around-baseurl/)

- `username` : github username
- `author` : github username.
explanation: github-blog-api filters issues based on author, so if someone else creates an issue, only the ones you created will show up.
- `repo` : `<repo_name>`, name of the repository, where you want gitpushblog to be.
- `posts_per_page` : number of posts to fetch at once (max 100), used by static generator and javascript in the theme
- `comments_per_page` : number of comments to fetch at once (max 100), used by static generator and javascript in the theme

- `comment.disabled` : if `true` no comments will show up, no one can comment.
- `comment.isGithub` : if `true` github comments will be shown.
- `comment.isGithubAuth` : if `true` a will show a comment box, where you can comment by authenticating with your github account.

**NOTE: This is super experimental and I think is **dangerous** too, please check the issue regarding this
if you'd like to help, I recommend you set it to `false` for now**
- `comment.isDisqus` : if `true` will let the theme declare `divs` and containers for the disqus commenting system,
disqus is already integrated in default theme, so just set this to `true` and `isGithub` to `false` if you want disqus comments.
- `comment.disqus_id` : your disqus id

- `firebaseConfig.*` : these firebase configuration options that you get from firebase, again this is highly experimental, recomment not using it for now.
If you want to experiment, then read [setting up githubAuth and commenting with firebase](#setting-up-githubauth-and-commenting-with-firebase)


### Setting up githubAuth and commenting with firebase
Follow [this guide](https://firebase.google.com/docs/web/setup) from firebase to get the credentials and put the ones needed in `_config.yml`

### Setting up GITHUB_AUTH_TOKEN Env
1. To get the `personal access token` go to [https://github.com/settings/tokens](https://github.com/settings/tokens)
give it the whole `repo` scope permission and give a name to your token and you'll have a newly generated token.
2. Copy that token
3. Create a file named `.env` inside the blog repository, put the token inside the `.env` file like this:
```
GITHUB_AUTH_TOKEN=YOUR_TOKEN_HERE_NO_SPACES
```
4. you're done, `.env` file is gitignored, so it will remain local to your system always.

## Templates and Theme details
The templates are created using [nunjucks](https://mozilla.github.io/nunjucks/). The directory structure
of a theme looks somethng like this:
```
.
├── index.html
├── post_page.html
├── category_page.html
│
├── pages
│   ├── about.html
│   └── projects.html
│
├── snippets
│   ├── aboutbox.html
│   ├── base.html
│   ├── footer.html
│   ├── labelsBox.html
│   └── navbar.html
│
└── static
    ├── css
    │   └── main.sass
    └── js
        ├── main.js
        ├── services.js
        └── utils.js
```
On running `npm run dev` or `npm run generate`, the output of these templates in `/dev` and `/dist` look something like this:
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
you can read the themes, currently there are two themes **gitpushblogdefault**,**KeepItSimple20**,**the-plain** and **lagom** they can be found in the `/themes` directory.

# Todo
- [ ] homepage, themes to have a landing page other than the blog page
- [ ] offline syntax highlighting, this maybe: https://www.npmjs.com/package/marky-markdown https://www.npmjs.com/package/pygments

# Contribute
- PRs and everything else is welcome
- It will be awesome if anyone can help in creating some themes, you can create themes using [nunjucks](https://mozilla.github.io/nunjucks/)
for now.
- There are a lot of issues, check them out. It will be really great if you can help :smile:

## Limitations
- Probably does not work on Windows as of now.
- Uses only nunjucks for now, let me know if to add support of any other templating engine.
- I am thinking to add gatsby(react) support.
- Currently only works with github pages (want to keep it that way)
- See issues for others.

# Contributors
- [@CodeDotJS](https://github.com/CodeDotJS)
- [@MaxySpark](https://github.com/MaxySpark)
- [@geekodour](https://github.com/geekodour)
