import { Match } from "./jsx.types"

export enum JsxAttributeValue {
  None, //
  Literal, // "..."
  Fragment, // <>
  Expression // {...}
}

export enum ClosedTag {
  SameLine, // <Tag Attr=....></Tag>
  Shorthand, // <Tag Attr=..../>
  DifferentLine, // if i'm willing to scan the elements tree
}

export class LineNavigate {
  match: Match;
  line: string;
  lineLen: number;
  index: number;
  pre: string = 'className=';
  start: string[] = ['{'];
  end: string[] = ['}']
  constructor(_line) {
    this.line = _line;
    this.lineLen = _line.length;
    this.index = 0;
    this.pre = 'className=';
    this.start = ['{'];
    this.end = ['}']
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
    if (this.line.includes('className=')) {
      this.Pre();
      return true
    } else {
      return false
    }
  }

  hasStart() {
    if (this.line.charAt(this.line.indexOf(this.pre) + 1) ===
      this.start[0]) {
      this.Start();
      return true
    } else {
      return false
    }
  }


  Pre() {
    const i = this.line.indexOf(this.pre);
    this.match = {
      Pre: {
        start: i,
        length: this.pre.length,
        end: i + this.pre.length,
        text: this.pre
      }
    }
    return i
  }

  Start() {
    const i = this.line.indexOf(this.pre) + 1
    this.match = {
      Start: {
        index: i,
        length: this.start.length,
        char: this.start[0]
      }
    }
  }

  // this is tricky
  End() {

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
  lookForAheah(type) { }
}