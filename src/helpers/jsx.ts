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

// JsxAttribute: [Name][Assignment][Value]
// Example: [className][=]["..."]
export type JsxAttribute = {
    Name: string,
    Value: JsxAttributeValue
}

// Tag condition
export type Tag = {
    Open,
    Closed: ClosedTag,
}

export type Match = {
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