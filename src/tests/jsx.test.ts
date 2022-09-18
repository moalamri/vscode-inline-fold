import test from 'ava';
import examples from './helper/examples';
import JSX from '../helpers/jsxClass';

// I used ava instead of vscode-test because the extension will crash if the parser failed
// So testing the parser alone against some examples is surely enough, I hope so :)
// You can trigger the tests with different ways without adding a suite/vsc-engine
test('Parser', t => {
	const _parser = new JSX(examples.comp);
	const ParsedComp = [
		{
			attr: 'className',
			end: 22,
			line: 2,
			start: 13,
		},
		{
			attr: 'className',
			end: 24,
			line: 3,
			start: 15,
		},
		{
			attr: 'className',
			end: 24,
			line: 4,
			start: 15,
		},
		{
			attr: 'className',
			end: 65,
			line: 5,
			start: 56,
		},
		{
			attr: 'disabled',
			end: 29,
			line: 6,
			start: 21,
		},
		{
			attr: 'aria-label',
			end: 30,
			line: 7,
			start: 20,
		},
		{
			attr: 'className',
			end: 24,
			line: 8,
			start: 15,
		},
		{
			attr: 'className',
			end: 39,
			line: 10,
			start: 30,
		},
		{
			attr: 'className',
			end: 24,
			line: 11,
			start: 15,
		},
		{
			attr: 'className',
			end: 24,
			line: 12,
			start: 15,
		},
		{
			attr: 'className',
			end: 40,
			line: 13,
			start: 31,
		},
		{
			attr: 'className',
			end: 39,
			line: 14,
			start: 30,
		},
		{
			attr: 'className',
			end: 30,
			line: 18,
			start: 21,
		},
		{
			attr: 'onClick',
			end: 35,
			line: 19,
			start: 28,
		},
		{
			attr: 'className',
			end: 28,
			line: 22,
			start: 19,
		},
	];
	const ParsedComp3 = [
		'<div className=\"value-here\" test=\"anything\" style=\'hi:there\'',
		'<p num=5>',
		'<span>',
		'<em>',
		'</em>',
		'</span>',
		'</p>',
		'</div>',
	];
	const ParsedComp4 = [
		'<div',
		'<h1>',
		'</h1>',
		'<p>',
		'</p>',
		'<h2>',
		'</h2>',
		'</div>',
	];
	t.deepEqual(_parser.Parse(), ParsedComp);
});