import {MathJax} from "mathjax3/mathjax.js";
export {MathJax} from "mathjax3/mathjax.js";

import "mathjax3/handlers/html.js";
import {TeX} from "mathjax3/input/tex.js";

let html = MathJax.document("<html></html>",{
  InputJax: new TeX()
});

MathJax.handleRetriesFor(function () {

    html.TestMath(process.argv[3] || '').compile();
    let math = html.math.pop().root;
    console.log(math.toString());

}).catch(err => {
  console.log(err.message);
  console.log(err.stack.replace(/\n.*\/system\.js:(.|\n)*/,""));
});
