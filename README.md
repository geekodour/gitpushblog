# gitpushblog
a static blog generator with node, nunjucks and the github api

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

** Write about the pros and cons.. sleepy can't utilize brain rn **

# Setup
There are **two ways** to setup this blogging system,

## Use the generator
(just an example right now)
Simply installing and running the blog generator cli app is the easiest, it will configure the
`blog_config.json` for you.
`npm install gitpushblog-generator` and then `gitpushblog-generator`

then you can simply run the three **generate**,**dev**,**upload** and **deploy** commands.

## Forking this repository
OR you can just `fork` this repository, and then enable `issues` in your
forked repo settings **(issues are disabled by default in forked repos)**
then `clone` this repository.

After that you'll need to configure the `blog_config.json` file in the root directory of the project.
then you can run the


# Usage

### blog_config.json

### npm scripts




# Eating my own dogfood
I created this github api wrapper to help with the github api calls
