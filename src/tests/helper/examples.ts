type examples = {

  comp: string;
  comp1: string;
  comp2: string;
  comp3: string;
  comp4: string;
  comp5: string;

};

const examples: examples = {

  comp: `
        <div className="text-lg">
            <p className='top-3'>top-3 with single quote</p>
            <p className="top-3">top-3 with double quote</p>
                        {/* some comment using the word className="hello" */}
             <button disabled={true} className="top-3">top-3 with attribute before</button>
            <button aria-label="some button" className="top-3" disabled={false} >top-3 with attribute before and after</button>
            <p className="top-3">{props.text}</p>
            <MyComponent />
            <MyOtherComponent className="top-3" />
            <p className="top-3">{\`{props.text} with template content\`}</p>
            <p className={\`{props.hello ? "top-3" : "bottom-3"}\`}>with template className</p>
            {props.hello && <p className="top-3">conditional render</p>}
            {props.hello ? <p className="top-3">ternary render true</p> : <p className="top-3">ternary render false</p>}

             {/* some random stuff? */}
            {props.hello ? (
                <div className={\`mt-3 \${props.buttonClassName} text-red-400 {props.text} text-sm\`}>
                    <button onClick={(e)=>console.log(\`hello text is {props.text}\`)} className="top-3">{\`{props.text} with template content\`}</button>
                </div>
            ) : (
                <p className="top-3">ternary render false</p>
            )}
        </div>
    `,
  comp1: `<div>
      <p><span><em>Hello world</em></span></p>
    </div>`,

  comp2: `<img src="" />`,

  comp3: `
<div className="value-here" test="anything" style='hi:there'>
  <p num=5><span><em>Hello world</em></span></p>
</div>`,

  comp4: `
  <div>
    <h1>wow</h1>
    <p>yeah</p>
    <h2>mantap</h2>
  </div>
`,

  comp5: `
    <h1>wow</h1>
    <p>yeah</p>
    <h2>mantap</h2>
`

};

export default examples;
