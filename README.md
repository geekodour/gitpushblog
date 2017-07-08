# gitpushblog
- A static blog generator.
- A set of npm scripts that make it easy to build a blog using the **githubAPI** and **nunjucks**.

It is sort of like [Jekyll](https://jekyllrb.com/), but currently does limited stuff.

see a [live demo]() here

# Table of contents

## Features
- uses npm scripts
- built with webpack and sass support
- works hasslefree with githubpages(both userpages and repo pages)
- easily add remove themes and edit themes.
- uses github api
- offline markdown draft support, live editing*

## Limitations
- Uses only nunjucks for now, let me know if to add support of any other
- I am thinking to add gatsby(react) support
- see issues for others
- currently only works with github pages (want to keep it that way)

## Why another static site generator

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
that I created, using that npm package you can make a fully client side blog if you want to, but here we're using it to generate
the static content.

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


## A note about github, git and gitpushblog

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
1. use `userpage` as the blog
2. use `userpage` as the intro page, use a `repopage` as the blog (I use this, this way the userpage does not need have gitpushblog and it's just a simple html file)
3. use `repopage` as the blog

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

## Tree of a blog generated by gitpushblog (`dist/`)
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

# Usage
gitpushblog uses **npm scripts**.

- **`npm run dev`** : Generate the development build of the blog in watch mode and serve in port 3000,
useful if you are writing a draft and want to see changes in the browser on reload, also helpful when
developing the theme. The files are in `/dev`

- **`npm run new <draft_name.md>`** : Create a new markdown file inside `/drafts` with appropriate template

- **`npm run upload`** : Lets you choose which **draft files** to upload to github issues,
and then uploads them. If upload was successful the uploaded file will be **deleted** from `/drafts`.
Useful when you're done writing a draft offline and ready to publish it online.

**IMPORTANT: You'll need to have your github `personal access token` set to the `GITHUB_AUTH_TOKEN` env. variable
for `npm run upload` to work. Read: `Setting GITHUB_AUTH_TOKEN`**

- **`npm run generate`** : Generates the production build to say, minifies static assets etc. The files are in `/dist`
- **`npm run push`** : It runs `npm run generate` first and then pushes the `/dist` directory to the `gh-pages` branch.
- **`npm run push:only`** : Only pushes the `/dist` directory to `gh-pages` branch.

# Configuration and `_config.yml`

## `_config.yml`




# Templates details
The templates are created using nunjucks, though template authors can write templates the way the want
but for the comment system to work properly they have to add three

If you're using react or any other javascript framework for making the blog you should
check the `main.js` file inside

# Todo
- [ ] Make the `main.sass` file cleaner and organized

# Contribute
- It will be awesome if anyone can help in creating some themes, it's almost just plain HTML and CSS
- will add issues and more contributing info soon.

TODO: minmal frebase config object
