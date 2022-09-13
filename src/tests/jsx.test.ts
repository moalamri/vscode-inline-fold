import test from 'ava';
import examples from './helper/examples';
import JsxParser from '../helpers/jsxClass';


test('Parser', t => {
	const _parser = new JsxParser();
	const ParsedComp = [
		'<div className="text-lg"',
		`<p className='top-3'>`,
		'</p>',
		'<p className="top-3">',
		'</p>',
		'<button disabled={true} className="top-3">',
		'</button>',
		'<button aria-label="some button" className="top-3" disabled={false} >',
		'</button>',
		'<p className="top-3">',
		'</p>',
		'<MyComponent />',
		'<MyOtherComponent className="top-3" />',
		'<p className="top-3">',
		'</p>',
		'<p className={`{props.hello ? "top-3" : "bottom-3"}`}>',
		'</p>',
		'<p className="top-3">',
		'</p>',
		'<p className="top-3">',
		'</p>',
		'<p className="top-3">',
		'</p>',
		'<div className={`mt-3 ${props.buttonClassName} text-red-400 {props.text} text-sm`}>',
		'<button onClick={(e)=>',
		'</button>',
		'</div>',
		'<p className="top-3">',
		'</p>',
		'</div>',
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
	t.log(_parser.Parser(examples.comp));
	t.deepEqual(_parser.Parser(examples.comp3), ParsedComp3);
	t.deepEqual(_parser.Parser(examples.comp), ParsedComp);
	t.deepEqual(_parser.Parser(examples.comp4), ParsedComp4);
});