# :mag: web-diff
> Visually diff web pages

## Why
- Handy tool to check if two URLs are rendering the same exact page
- Quickly identify subtle differences


## :rocket: Install
```
$ npm install -g web-diff
```

### npx
```
$ npx web-diff ...
```

## :beginner: Usage
```
$ web-diff <URL A> <URL B>
```

_eg. See how many pixels are different between Google and Google Images_
```
$ web-diff http://google.com https://images.google.com
```

### 💾 Save images

_eg. Save files `googleDiff.A.png`, `googleDiff.B.png` and `googleDiff.diff.png`_
```
$ web-diff -o googleDiff http://google.com https://images.google.com
```
