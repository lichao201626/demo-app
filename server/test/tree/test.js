const Rule = require('./rule');
const LeafRule = require('./leafRule');
const parentRule = require('./parentRule');
var rs = require('./rules');
for (let i = 0; i < 2; i++) {
    new LeafRule();
}
for (let i = 0; i < 1; i++) {
    new parentRule();
}
function show() {
    rs.rules.forEach(rule => {
        console.log(rule.toString() + '*********');
        rule.showSelf();
    });
}
show();
/* let rulemap = new Map();
let ruleObj = new Rule('a', 'x', 'e');
console.log(ruleObj.toString());

rulemap.set(0, randomLeafRule());
rulemap.set(1, randomLeafRule());
rulemap.set(2, randomLeafRule());
rulemap.set(3, randomLeafRule());
console.log(rulemap);
console.log('parentRule', randomParentRule()); */