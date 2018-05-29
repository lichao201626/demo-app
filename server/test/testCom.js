var a = '199999999999999999';
var b = Number(a);
var c = '99999999999999999';

console.log(a<c);
var Big = require('big.js');
function compareAuto(a,b,oper){

    if (isNaN(a) || isNaN(b)) {
        console.log('falseaaaaaaaaa');
        return false;
    }
    _a = Big(+a.toString());
    _b = Big(+b.toString());

    if (oper == '>') {
        return _a.gt(_b);
    }
    if (oper == '>=') {
        console.log('sssssssssssssssss');
        return _a.gte(_b);
    }
    if (oper == '<') {
        return _a.lt(_b);
    }
    if (oper == '<=') {
        return _a.lte(_b);
    }
}
console.log(compareAuto(a, c, '<='));

