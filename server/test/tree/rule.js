var rs = require('./rules');
function findRuleByName(ruleName) {
    let res;
    rs.rules.forEach(rule => {
        if (rule.name == ruleName) {
            res = rule;
        }
    });
    return res;
}
function ifRule(ruleName) {
    let flag = false;
    rs.rules.forEach(rule => {
        if (rule.name == ruleName) {
            flag = true;
        }
    });
    return flag;
}

function showRule(rule) {
    if (ifRule(rule.left)) {
        let leftRule = findRuleByName(rule.left);
        leftRule.showSelf();
    } else {
        console.log(rule.left);
    }
    console.log(rule.oper);
    if (ifRule(rule.right)) {
        let rightRule = findRuleByName(rule.right);
        rightRule.showSelf();
        // showRuleRight(rightRule);
    } else {
        console.log(rule.right);
    }
}
class Rule {
    constructor(param1, oper, param2, isLeaf) {
        this.name = 'Rule' + Math.floor(Math.random() * 999999);
        this.left = param1;
        this.oper = oper;
        this.right = param2;
        this.isLeaf = isLeaf;
        this.joinRules();
    }
    toString() {
        // console.log(this.left + this.oper + this.right);
        return this.name + ':' + this.left + this.oper + this.right;
    }
    joinRules() {
        rs.rules.set(this.name, this);
    }
    showSelf() {
        showRule(this);
    }
}
module.exports = Rule;