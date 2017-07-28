# How to write themes for gitpushblog
If you are familiar with HTML and CSS you are good to go.
To create a new theme, run `npm run theme <theme_name>`, boilerplate code will be generated inside `/themes/<theme_name>`, now you can start modifying the theme accordingly.

You can develop the theme inside gitpushblog's `/theme` directory, but if you want to create separate git repository for the theme,
then to push changes to your theme repository you can do the following after you **add** and **commit** changes to `<repo_name>`.

`git subtree push --prefix <path_to_theme> <https_git_url_of_repo_of_theme> <branch> --squash`

for example you cloned gitpushblog into `<repo_name>` and `<repo_name>` has this theme called **the-plain** inside `/themes` directory,
then you can do the following to push changes to the theme repository.
```
$ git subtree push --prefix themes/the-plain https://github.com/<username>/the-plain.git master --squash
```
