type Match = {
  Pre?: {
    index: number,
    text: string;
  },
  Start?: {
    index: number,
    char: string;
  },
  Content?: {
    length: number,
    text: string
  },
  End?: {
    index: number,
    char: string;
  }
}

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

  Pre() {
    if(!this.eLines) return;
    this.eLines.forEach((line, i) => {
      if(line.indexOf(this.pre)) {
        this.match.Pre = {
          index: i,
          text: line
        }
      }
    })
  }

  private parse() {
    let match: Match;
    const props: object[] = [];
    if(this.hasMatch()) {
      
    }
    //return elem;
  }

  private hasMatch() {
   const match: object[] = [];
    return match
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