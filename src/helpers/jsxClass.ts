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

  next() {
    this.index++;
    return this.line.charAt(this.index);
  }

  prev() {
    this.index--;
    return this.line.charAt(this.index);
  }

  curr() {
    return this.line.charAt(this.index);
  }

  hasPre() {
    return this.line.includes('className=');
  }

  indexAfterPre() {
    this.index = this.line.indexOf('className=') + 'className='.length;
    return this.index
  }

  at(i) {
    return this.line.charAt(i)
  }

  passThis(char) {
    if (this.curr() === char) {
      this.next();
      return true;
    } else {
      return false;
    }
  }

  peekNext() {
    return this.line.charAt(this.index + 1);
  }

  lookForAheah(type) {}
}
