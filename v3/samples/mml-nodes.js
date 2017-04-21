import {MathJax} from "mathjax/mathjax.js";
export {MathJax} from "mathjax/mathjax.js";

import "mathjax/handlers/html.js";
import {MathML} from "mathjax/input/mathml.js";

let html = MathJax.HandlerFor("<html></html>",{
  InputJax: new MathML()
});

import {TestMmlVisitor as MmlVisitor} from 'MmlTree/js/TestMmlVisitor.js';
//import {SerializedMmlVisitor as MmlVisitor} from 'MmlTree/js/SerializedMmlVisitor.js';
let visitor = new MmlVisitor();
let toMathML = function (node) {return visitor.visitTree(node,html.document)};

MathJax.HandleRetriesFor(function () {

    html.TestMath(process.argv[3] || '')
        .Compile();

    let math = html.math.pop();
    console.log(toMathML(math.root));

}).catch(err => {
  console.log(err.message);
  console.log(err.stack.replace(/\n.*\/system\.js:(.|\n)*/,""));
});