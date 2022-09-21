import { JsxAttributeValue, ClosedTag } from "./jsx";

// JsxAttribute: [Name][Assignment][Value]
// Example: [className][=]["..."]

export type JsxAttribute = {
  Name: string;
  Value: JsxAttributeValue;
};
// Tag condition

export type Tag = {
  Open;
  Closed: ClosedTag;
};

export type Match = {
  Pre?: {
    start: number;
    length: number;
    end: number;
    text: string;
  };
  Start?: {
    index: number;
    length: number;
    char: string;
  };
  Content?: {
    index: number;
    length: number;
    text: string;
  };
  End?: {
    index: number;
    length: number;
    char: string;
  };
};