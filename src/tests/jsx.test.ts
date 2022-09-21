import test from 'ava';
import examples from './helper/examples';
import { LineNavigate } from '../helpers/jsx';

// I used ava instead of vscode-test because the extension will crash if the parser failed
// So testing the parser alone against some examples is surely enough, I hope so :)
// You can trigger the tests with different ways without adding a suite/vsc-engine
test('Parser', t => {
	const lines = examples.comp.split(/[\n]+/);
	const expect = [
	'"',
	'\'',
	'"',
	'"',
	'"',
	'"',
	'"',
	'"',
	'"',
	'{',
	'"',
	'"',
	'{',
	'"',
	'"']
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
	let result = []
	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		const navigator = new LineNavigate(line);
		if(navigator.hasPre()) {
			navigator.indexAfterPre();
			result.push(navigator.curr())
		}
	}
	t.deepEqual(result, expect);
});