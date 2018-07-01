class Rule {
    constructor(param1, oper, param2) {
        this.name = 'Rule' + Math.floor(Math.random() * 999999);
        this.left = param1;
        this.oper = oper;
        this.right = param2;
    }
    toString() {
        // console.log(this.left + this.oper + this.right);
        return this.name + ':' + this.left + this.oper + this.right;
    }
}
var rulemap = new Map();
var db = ['mysql1', 'mysql2', 'mysql3', 'oracle1', 'oracle2', 'oracle3'];
var sqls = ['sql1', 'sql2', 'sql3'];
var operConst = {
    0: '&&',
    1: '||',
    2: '==',
    3: '!='
};
function randomLeafRule() {
    let r1 = Math.floor(Math.random() * 6);
    let r2 = Math.floor(Math.random() * 3);
    let r3 = Math.floor(Math.random() * 2 + 2);
    // return
    let param1 = db[r1];
    let param2 = sqls[r2];
    let oper = operConst[r3];
    let rule = new Rule(param1, oper, param2);
    // rule.toString();
    console.log(rule.toString());
    return rule;
}
function randomParentRule() {
    var length = rulemap.size;
    let r1 = Math.floor(Math.random() * length);
    let r2 = Math.floor(Math.random() * length);
    let r3 = Math.floor(Math.random() * 2);
    // return
    console.log('pppppplength', r1, r2);
    let param1 = rulemap.get(r1).name;
    console.log('pppppp', param1);
    let param2 = rulemap.get(r2).name;
    let oper = operConst[r3];
    let rule = new Rule(param1, oper, param2);
    // rule.toString();
    console.log(rule.toString());
    return rule;
}
function addOneRule() {
    rulemap.add(randomLeafRule());
}
function updateOneRule() {

}
function deleteOneRule() {

}
function buildRuleTree() {

}

function showRuleTree() {

}
rulemap.set(0, randomLeafRule());
rulemap.set(1, randomLeafRule());
rulemap.set(2, randomLeafRule());
rulemap.set(3, randomLeafRule());
console.log(rulemap);
console.log('parentRule', randomParentRule());
