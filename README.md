# Adam Di Pardo Portfolio Site

## Developing

Install Node, NPM, and Gulp.

1. Run `npm install`
2. Run `gulp`
3. Visit the website at `http://127.0.0.1:8000/`, changes to assets will trigger a live-reoad.

### The Flickr Random Photo PHP

Requires PHP (with curl) to be installed.

1. In a separate terminal window/tab, run `php -S 127.0.0.1:8001`. The front-end will connect to the PHP server to run the `random-photo.php` script.

## Deploying

Run `gulp dist`, and the website will be output to the `dist` directory.