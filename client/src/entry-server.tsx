import { createElement } from "react";
import { renderToString } from "react-dom/server";
import App from "./App";

export function render(url: string) {
  return renderToString(createElement(App, { ssrPath: url }));
}
