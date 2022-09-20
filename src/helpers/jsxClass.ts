import type {  Match, Tag, JsxAttribute  } from './jsx';

export default class JSX {
  private eLines: string[];
  match: Match;
  pre: string;
  start: string;
  end: string;
  
    public Parse() {
      return this.parseTag();
    }

  // for testing only
  // using regex
    private parseTag() {
        const regex = /(?!<.*\s+)([a-zA-Z0-9-:])*?(?=\s*?[^\w]*?=)/;
        const props: object[] = []
    
        this.eLines.forEach((v,i) => {
          let match;
          if ((match = regex.exec(v)) !== null) {
            props.push({
              start: match.index,
              attr: match[0],
              end: match.index + match[0].length,
              line: i+1
           })
          }
        })
      return props;
    }


  // For testing only
    constructor(_editorText: string) {
      this.match = {}
      this.eLines = _editorText.split(/\n/);
      this.pre = "className=";
      this.start = "{";
      this.end = "}";
    }
}


export class LineNavigate {
  line: string;
  lineLen: number;
  index: number;
  constructor(_line) {
    this.line = _line;
    this.lineLen = _line.length;
    this.index = 0;
  }

  // Move a step ahead and return the next character (Current)
  next() {
    this.index++;
    return this.line.charAt(this.index);
  }

  // Move a step back and return the previous character (Current)
  prev() {
    this.index--;
    return this.line.charAt(this.index);
  }

  // Get the current chart in the current location
  curr() {
    return this.line.charAt(this.index);
  }

  // Check if the current passed line has an attribute or a string in `Pre` configuration
  hasPre() {
    return this.line.includes('className=');
  }

  // Get the index of the character that follows Pre configuration.
  // `className=`[index] <-- should be the `Start` character
  indexAfterPre() {
    this.index = this.line.indexOf('className=') + 'className='.length;
    return this.index
  }

  // Return the character at specific location without changing the index
  at(i: number) {
    return this.line.charAt(i)
  }

  /** Usefull to skip some characters like whitespace or so.
  /* @param {char} character to skip
  */
  passThis(char: string) {
    if (this.curr() === char) {
      this.next();
      return true;
    } else {
      return false;
    }
  }

  // Return the character of the next index without changing current walk
  peekNext() {
    return this.line.charAt(this.index + 1);
  }

  // TODO
  lookForAheah(type) {}
}
