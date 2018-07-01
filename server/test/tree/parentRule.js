const operConst = {
    0: '&&',
    1: '||'
};
var rs = require('./rules');
var Rule = require('./rule');
function getNames() {
    let ruleNames = [];
    rs.rules.forEach(rule => {
        ruleNames.push(rule.name);
    });
    return ruleNames;
}
class ParentRule extends Rule {
    constructor(param1, oper, param2) {
        var length = rs.rules.size;
        console.log(length);
        let r1 = Math.floor(Math.random() * length);
        let r2 = Math.floor(Math.random() * length);
        let r3 = Math.floor(Math.random() * 2);
        // return
        console.log('pppppplength', r1, r2);
        let ruleNames = getNames();
        param1 = param1 || ruleNames[r1];
        param2 = param2 || ruleNames[r2];
        console.log('pppppp', param1);
        oper = oper || operConst[r3];
        super(param1, oper, param2, false);
    }
}
module.exports = ParentRule;
