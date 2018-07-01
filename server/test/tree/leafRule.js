const db = ['mysql1', 'mysql2', 'mysql3', 'oracle1', 'oracle2', 'oracle3'];
const sqls = ['sql1', 'sql2', 'sql3'];
const operConst = {
    2: '==',
    3: '!='
};
const Rule = require('./rule')
class LeafRule extends Rule {
    constructor(param1, oper, param2) {
        let r1 = Math.floor(Math.random() * 6);
        let r2 = Math.floor(Math.random() * 3);
        let r3 = Math.floor(Math.random() * 2 + 2);
        // return
        param1 = param1 || db[r1];
        param2 = param2 || sqls[r2];
        oper = oper || operConst[r3];
        super(param1, oper, param2, true);
    }
}
module.exports = LeafRule;
