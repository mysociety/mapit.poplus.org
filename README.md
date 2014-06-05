# mapit.poplus.org

The promotional site for the Poplus component, MapIt. Compiled using Jekyll and hosted by Github at http://mapit.poplus.org

## Local development

The MapIt site inherits almost all of its styling from the shared [poplus-theme](https://github.com/mysociety/poplus-theme) submodule. You should not edit the files inside the submodule directory (`/theme`) unless you want those changes to be shared with all other Poplus component sites.

Styling changes specific to the MapIt site should be made in `assets/sass/_mapit-styles.scss`.

Compile the Sass files using [(docs)](http://sass-lang.com/documentation/file.SASS_REFERENCE.html#using_sass):

```shell
sass --watch assets/sass:css
```

## Running a local web server

You can preview your changes without pushing to Github by running a local Jekyll web server.

First, install Jekyll, as per the Jekyll docs, then go into the project folder and start a local server:

```shell
gem install jekyll
cd mapit.poplus.org
jekyll serve --watch --baseurl ''
```

The `--baseurl` option is part of [an elegant hack](http://jekyllrb.com/docs/github-pages/#project_page_url_structure) to replicate the Github Pages hosting structure locally.

As long as the server is running, your site will be available at http://0.0.0.0:4000. Local changes will be reflected automatically, thanks to the `--watch` flag.

Remember, when you’re editing links or paths in the HTML, to use the `{{ site.baseurl }}` template tag for internal links. Take a look in `_includes/html-head.html` for an example.

## Deploying changes

The site is hosted via Github Pages. To ‘deploy’ your changes from the `master` branch, merge them into the `gh-pages` branch:

```shell
git checkout gh-pages
git merge master
git push origin gh-pages
```

Your changes will then be visible at http://mysociety.github.io/mapit.poplus.org and, once we’ve sorted out DNS, http://mapit.poplus.org too.

Remember to switch back into the `master` branch (or a feature branch) when continuing to make changes after deployment!

```shell
git checkout master
```
