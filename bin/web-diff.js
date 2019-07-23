#!/usr/bin/env node

const webDiff = require('../lib');

const { argv } = require('yargs')
	.scriptName('web-diff')
	.usage('Usage: $0 <URL A> <URL B>')
	.demandCommand(2)
	.options({
		'output': {
			alias: 'o',
			describe: 'Path to save the diff image to',
			string: true,
		},
		'verbose': {
			alias: 'v',
			describe: 'Verbose output',
			boolean: true,			
		},
	});

webDiff(argv);
