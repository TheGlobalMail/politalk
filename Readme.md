# Politalk

1. Install yeoman directly from git
2. Run `yeoman install`
3. Jump into `app/components/tgm-bootstrap` and run `bower install` (So bootstrap get installed as a sibling for LESS references)
4. Jump back up `cd ../../../`
5. Run `grunt install`
6. Start server with `yeoman server`
7. Build with `yeoman build` or `yeoman build:minify` (the latter minifies HTML)

### Deployment

1. `git checkout -b deploy`
2. `yeoman build`
3. `yeoman server:dist` (Just build works locallay)
4. `git add dist/`
5. `git commit -m "Build" dist/`
6. `git push heroku deploy:master --force`
7. Check app at http://politalk.herokuapp.com
8. `git checkout master`
9. `git branch -D deploy`