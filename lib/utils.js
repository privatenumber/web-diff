const fs = require('fs-extra');
const path = require('path');
const { promisify } = require('util');
const { PNG } = require('pngjs');

PNG.prototype.$parse = promisify(PNG.prototype.parse);

const waitOnStream = stream => new Promise(r => stream.on('close', r));

async function screenshot({ browser, url }) {
  const page = await browser.newPage();
  await page.setViewport({ width: 960, height: 1 });
  await page.goto(url);
  const screenshot = await page.screenshot({
    fullPage: true,
  });

  const png = new PNG({ width: 800, height: 13000 });
  await png.$parse(screenshot);
  return png;
}

async function savePng({ png, saveTo }) {
  await fs.mkdirp(path.dirname(saveTo));
  return waitOnStream(png.pack().pipe(fs.createWriteStream(saveTo)));
}

function crop({ png, width, height }) {
  if (png.width === width && png.height === height) {
    return png;
  }

  const newPng = new PNG({ width, height });
  png.bitblt(newPng, 0, 0, width, height, 0, 0);
  return newPng;
}


module.exports = {
  screenshot,
  savePng,
  crop,
};
