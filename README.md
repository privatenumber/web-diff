# web-diff
> Visually diff web pages

## Why
- Quick way to check if two URLs are rendering the same exact page


## Install
```
$ npm install -g web-diff
```

### npx
```
$ npx web-diff ...
```

## Usage
```
$ web-diff <URL A> <URL B>
```

_eg. Saving files googleDiff.A.png, googleDiff.B.png and googleDiff.diff.png_
```
$ web-diff http://google.com https://images.google.com -o googleDiff
```
