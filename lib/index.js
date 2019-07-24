const puppeteer = require('puppeteer');
const Listr = require('listr');
const pixelmatch = require('pixelmatch');
const { PNG } = require('pngjs');
const { screenshot, savePng, crop } = require('./utils');

function webDiff(opts) {
  const tasks = new Listr([
    {
      title: 'Initializing',
      task: async (ctx) => {
        ctx.browser = await puppeteer.launch();
      },
    },
    {
      title: 'Getting screenshots',
      task: (ctx) => new Listr([
        {
          title: `Screenshotting: ${ctx.urlA}`,
          task: async (ctx) => {
            ctx.pngA = await screenshot({
              browser: ctx.browser,
              url: ctx.urlA,
            });
          },
        },
        {
          title: `Screenshotting: ${ctx.urlB}`,
          task: async (ctx) => {
            ctx.pngB = await screenshot({
              browser: ctx.browser,
              url: ctx.urlB,
            });
          },
        }
      ], { concurrent: true }),
    },
    {
      title: 'Diffing screenshots',
      task: (ctx) => {
        let { pngA, pngB } = ctx;

        const width = Math.min(pngA.width, pngB.width);
        const height = Math.min(pngA.height, pngB.height);

        if (pngA.data.length !== pngB.data.length) {
          pngA = crop({ png: pngA, width, height });
          pngB = crop({ png: pngB, width, height });
        }

        const diffPng = new PNG({ width, height });

        ctx.pxDiff = pixelmatch(pngA.data, pngB.data, diffPng.data, width, height, { threshold: 0 });

        if (ctx.outputFilename) {
          return Promise.all([
            savePng({
              png: pngA,
              saveTo: `${ctx.outputFilename}.A.png`,
            }),
            savePng({
              png: pngB,
              saveTo: `${ctx.outputFilename}.B.png`,
            }),
            savePng({
              png: diffPng,
              saveTo: `${ctx.outputFilename}.diff.png`,
            }),
          ]);
        }
      },
    },
    {
      title: 'Cleanup',
      task: ctx => ctx.browser.close(),
    },
  ], {
    renderer: opts.verbose ? 'default' : 'silent',
  });

  tasks.run({
    urlA: opts._[0],
    urlB: opts._[1],
    outputFilename: opts.output,
  }).then(
    (ctx) => {
      console.log(ctx.pxDiff);
    },
    (err) => {
      console.error(err);
    },
  );
}

module.exports = webDiff;
